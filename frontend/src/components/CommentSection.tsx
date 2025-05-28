import React, { useEffect, useState } from "react";
import { FiChevronDown, FiHeart } from "react-icons/fi";
import axios from "axios";

interface CommentSectionProps {
  productId: string;
}

interface Comment {
  _id: string;
  username: string;
  comment: string;
  hearts: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ productId }) => {
  const [username] = useState("user"); // Replace with actual user logic if needed
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/products/${productId}`
        );
        setComments(res.data.comments || []);
      } catch (err) {
        // handle error
      }
      setLoadingComments(false);
    };
    if (productId) fetchComments();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === "") return;
    try {
      const res = await axios.post(
        `http://localhost:3000/products/${productId}/comments`,
        {
          username,
          comment,
        }
      );
      setComments([res.data, ...comments]);
      setComment("");
    } catch (err) {
      // handle error
    }
  };

  const handleDelete = async (idx: number) => {
    const commentId = comments[idx]._id;
    try {
      await axios.delete(
        `http://localhost:3000/products/${productId}/comments/${commentId}`
      );
      setComments(comments.filter((_, i) => i !== idx));
      setDropdownOpen(null);
    } catch (err) {
      // handle error
    }
  };

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditComment(comments[idx].comment);
    setDropdownOpen(null);
  };

  const handleEditSave = async (idx: number) => {
    const commentId = comments[idx]._id;
    try {
      const res = await axios.patch(
        `http://localhost:3000/products/${productId}/comments/${commentId}`,
        {
          comment: editComment,
        }
      );
      const updated = [...comments];
      updated[idx] = res.data;
      setComments(updated);
      setEditIdx(null);
      setEditComment("");
    } catch (err) {
      // handle error
    }
  };

  const handleReact = async (idx: number) => {
    const commentId = comments[idx]._id;
    try {
      const res = await axios.post(
        `http://localhost:3000/products/${productId}/comments/${commentId}/react`
      );
      const updated = [...comments];
      updated[idx] = res.data;
      setComments(updated);
      setDropdownOpen(null);
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative flex items-start gap-2">
          <p className="username mt-2 text-gray-600 text-left">
            @{username}
          </p>
          <textarea
            className="border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 pr-20 text-left"
            rows={2}
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="absolute bottom-2 right-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Post
          </button>
        </div>
      </form>
      <div className="mt-6 flex-1 overflow-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm text-left">No comments yet.</p>
        ) : (
          <ul className="space-y-4 list-none p-0 m-0">
            {comments.map((c, idx) => (
              <li
                key={idx}
                className="comment-row bg-gray-100 p-3 rounded shadow-sm text-gray-800 flex items-center relative"
                style={{ listStyleType: "none", width: "100%" }}
              >
                <div className="comment-text flex-1 text-left">
                  <span className="font-semibold text-blue-600">
                    @{c.username}:&nbsp;
                  </span>
                  {editIdx === idx ? (
                    <span>
                      <input
                        className="border rounded p-1 mr-2"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                      <button
                        className="text-xs text-green-600 mr-1"
                        onClick={() => handleEditSave(idx)}
                      >
                        Save
                      </button>
                      <button
                        className="text-xs text-gray-500"
                        onClick={() => setEditIdx(null)}
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <span>{c.comment}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                    onClick={() => handleEdit(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex items-center text-pink-500 hover:text-pink-700"
                    title="React"
                    onClick={() => handleReact(idx)}
                  >
                    <FiHeart className="mr-1" /> {c.hearts}
                  </button>
                  <button
                    className={`px-2 py-1 rounded hover:bg-gray-200 flex items-center transition-transform duration-200 ${
                      dropdownOpen === idx ? "chevron-flip" : ""
                    }`}
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === idx ? null : idx)
                    }
                  >
                    <FiChevronDown size={20} />
                  </button>
                  {dropdownOpen === idx && (
                    <div className="dropdown-menu absolute right-0 top-8 bg-white border rounded shadow-md z-10">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleReact(idx)}
                      >
                        React
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
