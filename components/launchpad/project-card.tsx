import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ProjectListItem } from "@/lib/launchpad/queries";
import { CategoryChip } from "./category-chip";
import { VoteButton } from "./vote-button";

interface ProjectCardProps {
  hasVoted: boolean;
  isAlquimista: boolean;
  isAuthenticated: boolean;
  project: ProjectListItem;
}

export function ProjectCard({
  project,
  hasVoted,
  isAuthenticated,
  isAlquimista,
}: ProjectCardProps) {
  return (
    <article className="group relative flex gap-4 bg-bg-2 p-4 transition-colors hover:bg-bg-3">
      <Image
        alt=""
        className="size-14 shrink-0 object-cover"
        height={56}
        src={project.logoUrl}
        width={56}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <h3 className="m-0 font-display font-medium text-ink text-xl leading-tight tracking-[-0.02em]">
            <Link
              className="after:absolute after:inset-0 hover:text-gold"
              href={`/launchpad/${project.slug}`}
            >
              {project.name}
            </Link>
          </h3>
          <p className="mt-1 mb-0 line-clamp-2 text-ink-3 text-note">
            {project.tagline}
          </p>
        </div>

        {project.categoryIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.categoryIds.map((categoryId) => (
              <CategoryChip categoryId={categoryId} key={categoryId} />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-[1] shrink-0 self-center">
        <VoteButton
          hasVoted={hasVoted}
          isAlquimista={isAlquimista}
          isAuthenticated={isAuthenticated}
          projectId={project.id}
          score={project.voteScore}
        />
      </div>
    </article>
  );
}
