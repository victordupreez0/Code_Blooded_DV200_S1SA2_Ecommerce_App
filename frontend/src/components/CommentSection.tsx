import React, { useEffect, useState } from "react";
import { FiChevronDown, FiHeart, FiTrash2 } from "react-icons/fi";
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
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editComment, setEditComment] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    const commentId = comments[idx]?._id;
    if (!commentId) return;
    try {
      await axios.delete(
        `http://localhost:3000/products/${productId}/comments/${commentId}`
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      // If editing, reset edit state if the deleted comment was being edited
      if (editIdx === idx) {
        setEditIdx(null);
        setEditComment("");
      }
      setError(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Failed to delete comment. Please try again.'
      );
    }
  };

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditComment(comments[idx].comment);
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
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded px-3 py-2 mb-2 text-sm">
          {error}
        </div>
      )}
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
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(idx);
                    }}
                  >
                    <FiTrash2 />
                  </button>
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
