import { PermissionsCard } from './PermissionsCard'
import { SettingsLayout } from './SettingsLayout'
import { SettingsTwoColumns } from './SettingsTwoColumns'
import { TeamAside } from './TeamAside'
import { TeamMembersCard } from './TeamMembersCard'

/** Team changes save on their own (invite, remove), so there is no form here. */
export function TeamSettings() {
  return (
    <SettingsLayout>
      <SettingsTwoColumns
        main={
          <>
            <TeamMembersCard />
            <PermissionsCard />
          </>
        }
        aside={<TeamAside />}
      />
    </SettingsLayout>
  )
}
