<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Imported application
- Preserve ROUT source structure and file-based routes; regenerate the route tree rather than copying it, so routing remains compatible with this host.
- Keep destination-generated Cloud integrations and hosting configuration; never transplant source environment secrets or project metadata.
- Original Neon/Better Auth and external service modules remain unconfigured until explicitly migrated or securely connected; Cloud enablement alone does not migrate those services.
