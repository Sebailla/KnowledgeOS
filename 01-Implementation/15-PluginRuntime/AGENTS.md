# AGENTS

This file applies to `01-Implementation/15-PluginRuntime`.

- Plugins SHALL use Plugin SDK public contracts only.
- Plugins SHALL NOT access private Engine repositories or internal implementations.
- Capabilities SHALL be explicit, least-privilege, revocable and auditable.
- Plugins SHALL NOT redefine Domain identity, UDM, DPM, Knowledge Graph authority or Personal Knowledge ownership.
- Plugin execution SHALL be isolated according to risk profile.
- Plugin failure SHALL NOT corrupt canonical or Personal Knowledge.
- Uninstall SHALL preserve user-owned data unless explicit deletion is approved.
