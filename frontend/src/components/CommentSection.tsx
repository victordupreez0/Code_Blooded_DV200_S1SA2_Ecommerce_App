import React, { useEffect, useState } from "react";
import { FiChevronDown, FiHeart, FiTrash2 } from "react-icons/fi";
import { FaHeart } from "react-icons/fa"; // Add this import
import axios from "axios";

interface CommentSectionProps {
  productId: string;
}

interface Comment {
  _id: string;
  userId: string;
  username: string;
  comment: string;
  hearts: number;
  likedBy?: string[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ productId }) => {
  const [username] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user).fullName || "user";
      }
    } catch {}
    return "user";
  });
  const [userId] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user)._id; 
      }
    } catch {}
    return null;
  });
  const [userRole] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user).role || "user";
      }
    } catch {}
    return "user";
  });
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
    if (comment.trim() === "") return; // Prevent empty comments
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to comment.");
        return;
      }
      // Only send the comment text; backend should use user info from JWT
      const res = await axios.post(
        `http://localhost:3000/products/${productId}/comments`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setComment("");
      setError(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to post comment. Please try again."
      );
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!commentId) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to delete a comment.");
        return;
      }
      await axios.delete(
        `http://localhost:3000/products/${productId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      // If editing, reset edit state if the deleted comment was being edited
      if (editIdx !== null) {
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
    // Only allow editing if the current user is the author
    if (String(comments[idx].userId) !== String(userId) && userRole !== 'admin') {
      setError("You can only edit your own comments.");
      return;
    }
    setEditIdx(idx);
    setEditComment(comments[idx].comment);
  };

  const handleEditSave = async (idx: number) => {
    // Only allow saving if the current user is the author or admin
    if (String(comments[idx].userId) !== String(userId) && userRole !== 'admin') {
      setError("You can only edit your own comments.");
      return;
    }
    const commentId = comments[idx]._id;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to edit a comment.");
        return;
      }
      const res = await axios.patch(
        `http://localhost:3000/products/${productId}/comments/${commentId}`,
        {
          comment: editComment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = [...comments];
      updated[idx] = res.data;
      setComments(updated);
      setEditIdx(null);
      setEditComment("");
      setError(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Failed to edit comment. Please try again.'
      );
    }
  };

  const handleReact = async (idx: number) => {
    const commentId = comments[idx]._id;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to like a comment.");
        return;
      }
      const res = await axios.post(
        `http://localhost:3000/products/${productId}/comments/${commentId}/react`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = [...comments];
      updated[idx] = res.data;
      setComments(updated);
      setError(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to like comment. Please try again."
      );
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
        <div className="relative flex flex-col items-start gap-2">
          <p className="username mt-2 text-luxury-primaryGold text-left">
            @{username}
          </p>
          <textarea
            className="border-none rounded-xl p-2 resize-none text-luxury-white bg-luxury-black/50 focus:outline-none focus:ring-2 focus:ring-luxury-primaryGold flex-2 pr-20 text-left placeholder:text-luxury-white"
            rows={2}
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="absolute bottom-2 right-2 bg-luxury-primaryGold text-black  px-4 py-2 rounded-3xl hover:text-white hover:bg-luxury-brown-darker transition"
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
                key={c._id}
                className="comment-row bg-luxury-brown-darker p-3 rounded-3xl shadow-sm text-gray-800 flex items-center relative"
                style={{ listStyleType: "none", width: "100%" }}
              >
                <div className="comment-text text-luxury-white flex-1 text-left">
                  <span className="font-semibold text-luxury-primaryGold">
                    @{c.username}:&nbsp;
                  </span>
                  {editIdx === idx ? (
                    <span>
                      <input
                        className="border-b bg-luxury-brown-darker focus:outline-none focus:ring-0 focus:border-b-luxury-primaryGold p-1 mr-2 text-luxury-white placeholder:text-luxury-white rounded-none"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                      <button
                        className="text-xs text-green-600 mr-1"
                        onClick={() => handleEditSave(idx)}
                        disabled={editComment.trim() === "" || editComment === c.comment}
                      >
                        Save
                      </button>
                      <button
                        className="text-xs text-gray-500"
                        onClick={() => { setEditIdx(null); setEditComment(""); }}
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <span>{c.comment}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {(String(userId) === String(c.userId) || userRole === 'admin') && (
                    <>
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(c._id);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                  <button
                    className={`flex items-center ${c.likedBy && c.likedBy.includes(userId) ? "text-pink-600" : "text-pink-500 hover:text-pink-700"}`}
                    title="React"
                    onClick={() => handleReact(idx)}
                  >
                    {c.likedBy && c.likedBy.includes(userId) ? (
                      <FaHeart className="mr-1" />
                    ) : (
                      <FiHeart className="mr-1" />
                    )} 
                    {c.hearts}
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
