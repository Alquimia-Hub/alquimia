"use client";

import { Blobatar as Generated } from "@blobatar/react";
import type * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

type GeneratedOptions = DistributiveOmit<
  React.ComponentProps<typeof Generated>,
  "name"
>;

export type BlobatarProps = React.ComponentProps<typeof Avatar> & {
  alt?: string;
  blobatar?: GeneratedOptions;
  name: string;
  src?: string;
};

export function Blobatar({
  name,
  src,
  alt,
  blobatar,
  ...props
}: BlobatarProps) {
  return (
    <Avatar {...props}>
      {src ? <AvatarImage alt={alt ?? name} src={src} /> : null}
      <AvatarFallback className="bg-transparent">
        <Generated {...blobatar} className="size-full" name={name} />
      </AvatarFallback>
    </Avatar>
  );
}
