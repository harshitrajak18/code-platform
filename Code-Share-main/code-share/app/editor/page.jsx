"use client";
import Editor from "../components/Editor";
import { useParams, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function EditorPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading</div>}>
        <Editor/>
      </Suspense>
    </div>
  );
}

export default EditorPage;
