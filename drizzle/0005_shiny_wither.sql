UPDATE "project" p SET "vote_score" = coalesce((
  SELECT sum(CASE WHEN u."is_alquimista" AND u."alquimista_checked_at" > now() - interval '7 days' THEN 3 ELSE 1 END)
  FROM "vote" v JOIN "user" u ON u."id" = v."user_id"
  WHERE v."project_id" = p."id"
), 0);
