"use client";
import React, { useEffect, useRef, useState } from "react";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { highlightActiveLine } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { FaCode } from "react-icons/fa6";
import toast from "react-hot-toast";
import { initSocket } from "./socket";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";
function Editor() {
  const searchParams = useSearchParams();
  const id = searchParams?.get("roomId");
  const name = searchParams?.get("name");

  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const hasJoined = useRef(false);
  const router = useRouter();
  const isSyncing = useRef(false);
  console.log(users);
  useEffect(() => {
    if (!editorRef.current?.editorView) {
      const state = EditorState.create({
        doc: "",
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          keymap.of(defaultKeymap),
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !isSyncing.current) {
              const code = update.state.doc.toString();
              socketRef.current?.emit("code-change", { roomId: id, code });
            }
          }),
        ],
      });
      const view = new EditorView({
        state,
        parent: editorRef.current,
      });
      editorRef.current.editorView = view;
    }
  }, [id]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (e) =>
        console.error("Socket error:", e.message)
      );
      socketRef.current.on("connect", () =>
        console.log("Socket connected", socketRef.current.id)
      );

      if (id && name) {
        if (hasJoined.current) return;
        hasJoined.current = true;
        socketRef.current.emit("join", { roomId: id, username: name });
      }

      socketRef.current.on("joined", ({ clients, username }) => {
        if (username !== name) toast.success(`${username} joined the room`);
        setUsers(clients);
      });

      socketRef.current?.on("code-update", ({ code }) => {
        const { editorView } = editorRef.current || {};
        if (editorView) {
          isSyncing.current = true;
          const transaction = editorView.state.update({
            changes: { from: 0, to: editorView.state.doc.length, insert: code },
          });
          editorView.dispatch(transaction);
          isSyncing.current = false;
        }
      });

      socketRef.current.on("disconnected", ({ username, socketId }) => {
        toast.success(`${username} left the room`);
        setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
      });
    };

    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off("joined");
      socketRef.current?.off("disconnected");
      socketRef.current?.off("code-update");
    };
  }, [id, name]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Room id copied successfully");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex">
      <aside className="bg-gray-800 p-7 flex flex-col items-center relative">
        <div className="flex items-center gap-2 text-xl font-semibold pt-10 pb-4">
          <FaCode /> <p>| Code Share</p>
        </div>
        <hr className="w-full mb-4 border-t border-white" />
        <div className="flex flex-col gap-2 overflow-y-auto">
          <p>Members</p>
          {users.map((user) => (
            <div
              key={user.socketId}
              className="flex bg-gray-700 p-2 rounded-md items-center gap-2"
            >
              <img
                className="w-10 h-10 rounded-full"
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                alt="User Avatar"
              />
              <p>{user.username.substring(0, 10)}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 flex flex-col gap-2">
          <button
            onClick={() => {
              handleCopy();
            }}
            className="bg-green-600 p-2 rounded-md font-semibold hover:bg-green-700"
          >
            Copy Room ID
          </button>
          <button
            onClick={() => {
              toast.success("Room left successfully");
              router.push("/");
            }}
            className="bg-red-600 p-2 rounded-md font-semibold hover:bg-red-700"
          >
            Leave Session
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-gray-800 p-4">
        <div
          ref={editorRef}
          className="h-full w-full p-2 bg-gray-900 border-2 border-gray-700 rounded overflow-y-auto"
        ></div>
      </main>
    </div>
  );
}

export default Editor;
