alter table public.reaction_scores
  add column if not exists mode text not null default 'basic';

alter table public.reaction_scores
  drop constraint if exists reaction_scores_mode_check;

alter table public.reaction_scores
  add constraint reaction_scores_mode_check check (mode in ('basic', 'advanced'));

create index if not exists reaction_scores_mode_score_created_idx
  on public.reaction_scores (mode asc, score_ms asc, created_at asc);
