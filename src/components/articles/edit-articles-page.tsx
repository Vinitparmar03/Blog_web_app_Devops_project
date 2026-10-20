"use client";

import {
  FormEvent,
  startTransition,
  useActionState,
  useState,
} from "react";

import dynamic from "next/dynamic";

import "react-quill-new/dist/quill.snow.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { updateArticles } from "@/actions/update-article";
import Image from "next/image";

type Article = {
  id: string;
  title: string;
  category: string;
  content: string;
  featuredImage: string | null;
};

// ReactQuill uses browser APIs such as `document`.
// Disable SSR so ReactQuill only loads in the browser.
const ReactQuill = dynamic(
  () => import("react-quill-new"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[200px] rounded-md border p-4 text-sm text-muted-foreground">
        Loading editor...
      </div>
    ),
  }
);

type EditPropsPage = {
  article: Article;
};

const EditArticlePage = ({ article }: EditPropsPage) => {
  const [content, setContent] = useState(article.content);

  const [formState, action, isPending] = useActionState(
    updateArticles.bind(null, article.id),
    { errors: {} }
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Add Quill content to the form data
    formData.append("content", content);

    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Edit Article
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Article Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Article Title
              </Label>

              <Input
                id="title"
                name="title"
                defaultValue={article.title}
                placeholder="Enter article title"
                required
              />

              {formState.errors.title && (
                <span className="text-sm font-medium text-red-500">
                  {formState.errors.title}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category
              </Label>

              <select
                id="category"
                name="category"
                defaultValue={article.category}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">
                  Select Category
                </option>

                <option value="technology">
                  Technology
                </option>

                <option value="programming">
                  Programming
                </option>

                <option value="web-development">
                  Web Development
                </option>
              </select>

              {formState.errors.category && (
                <span className="text-sm font-medium text-red-500">
                  {formState.errors.category}
                </span>
              )}
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label htmlFor="featuredImage">
                Featured Image
              </Label>

              {article.featuredImage && (
                <div className="mb-4">
                  <Image
                    src={article.featuredImage}
                    alt="Current featured"
                    width={192}
                    height={128}
                    className="rounded-md object-cover"
                  />

                  <p className="mt-2 text-sm text-muted-foreground">
                    Current featured image
                  </p>
                </div>
              )}

              <Input
                id="featuredImage"
                name="featuredImage"
                type="file"
                accept="image/*"
              />

              {formState.errors.featuredImage && (
                <span className="text-sm font-medium text-red-500">
                  {formState.errors.featuredImage}
                </span>
              )}
            </div>

            {/* Article Content */}
            <div className="space-y-2">
              <Label>
                Content
              </Label>

              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
              />

              {formState.errors.content && (
                <span className="text-sm font-medium text-red-500">
                  {formState.errors.content[0]}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
              >
                Discard Changes
              </Button>

              <Button
                disabled={isPending}
                type="submit"
              >
                {isPending
                  ? "Loading..."
                  : "Update Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditArticlePage;
