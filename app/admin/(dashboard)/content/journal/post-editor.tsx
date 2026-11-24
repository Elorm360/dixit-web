"use client";

import { useState } from "react";
import { Field, PhotoField, SectionForm } from "@/components/admin/content-fields";
import { savePost } from "../actions";

export type PostDraft = { id: string | null; title: string; slug: string; excerpt: string; body: string; image: string; published_on: string; published: boolean };

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function PostEditor({ post, storageBase }: { post: PostDraft; storageBase: string }) {
  const [slug, setSlug] = useState(post.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(post.id));

  return (
    <SectionForm action={savePost.bind(null, post.id)} saveLabel="Save post">
      <div className="grid gap-8 xl:grid-cols-[1fr_16rem]">
        <div className="space-y-5">
          <Field label="Title">
            <input name="title" defaultValue={post.title} maxLength={160} required className="kd-input" onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))} />
          </Field>
          <Field label="Web address">
            <div className="flex items-stretch">
              <span className="flex items-center border border-r-0 border-kd-black/15 bg-kd-cream px-3 text-xs text-kd-gray">/journal/</span>
              <input name="slug" value={slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" className="kd-input" onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} />
            </div>
          </Field>
          <Field label="Summary" hint="One or two sentences shown on the Journal page.">
            <textarea name="excerpt" defaultValue={post.excerpt} maxLength={400} rows={2} className="kd-input resize-y" />
          </Field>
          <Field label="Article" hint="Separate paragraphs with an empty line.">
            <textarea name="body" defaultValue={post.body} rows={16} className="kd-input resize-y leading-7" />
          </Field>
        </div>
        <div className="space-y-6">
          <PhotoField name="image" folder="journal" label="Cover photo" initialPath={post.image} storageBase={storageBase} aspect="aspect-[4/3]" />
          <Field label="Date">
            <input name="published_on" type="date" defaultValue={post.published_on} required className="kd-input" />
          </Field>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="published" defaultChecked={post.published} className="h-5 w-5 accent-kd-gold-dark" />
            <span className="text-sm">Published — visible on the website</span>
          </label>
        </div>
      </div>
    </SectionForm>
  );
}
