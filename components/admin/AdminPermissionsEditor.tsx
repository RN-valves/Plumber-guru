"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ADMIN_PERMISSION_GROUPS,
  ADMIN_ROLE_PRESETS,
} from "@/lib/admin-permissions";
import type { AdminPermission, AdminRoleType } from "@/types/admin-permissions";

type AdminPermissionsEditorProps = {
  adminRole: AdminRoleType;
  permissions: AdminPermission[];
  onChange: (permissions: AdminPermission[]) => void;
  disabled?: boolean;
};

export function AdminPermissionsEditor({
  adminRole,
  permissions,
  onChange,
  disabled = false,
}: AdminPermissionsEditorProps) {
  const [selected, setSelected] = useState<AdminPermission[]>(permissions);

  useEffect(() => {
    setSelected(permissions);
  }, [permissions]);

  useEffect(() => {
    if (adminRole === "super_admin") {
      setSelected(ADMIN_ROLE_PRESETS.super_admin);
    }
  }, [adminRole]);

  useEffect(() => {
    if (adminRole === "super_admin") {
      onChange(ADMIN_ROLE_PRESETS.super_admin);
    }
  }, [adminRole, onChange]);

  const togglePermission = (permission: AdminPermission, checked: boolean) => {
    if (disabled || adminRole === "super_admin") return;

    const next = checked
      ? Array.from(new Set([...selected, permission]))
      : selected.filter((item) => item !== permission);

    setSelected(next);
    onChange(next);
  };

  const applyPreset = () => {
    if (disabled || adminRole === "super_admin") return;
    const preset = ADMIN_ROLE_PRESETS[adminRole];
    setSelected(preset);
    onChange(preset);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Section access</p>
          <p className="text-xs text-muted-foreground">
            Choose which admin areas this user can open.
          </p>
        </div>
        {adminRole !== "super_admin" && (
          <button
            type="button"
            onClick={applyPreset}
            disabled={disabled}
            className="text-xs font-semibold text-[#F97316] hover:underline disabled:opacity-50"
          >
            Reset to role defaults
          </button>
        )}
      </div>

      {adminRole === "super_admin" ? (
        <p className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-200">
          Super admins always have full access to every admin section.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ADMIN_PERMISSION_GROUPS.map((group) => (
            <div
              key={group.id}
              className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
            >
              <p className="text-sm font-semibold text-foreground">{group.label}</p>
              <div className="mt-3 space-y-3">
                {group.permissions.map((permission) => {
                  const checked = selected.includes(permission.key);
                  return (
                    <label
                      key={permission.key}
                      className="flex cursor-pointer items-start gap-3"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          togglePermission(permission.key, value === true)
                        }
                        disabled={disabled}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="block text-sm font-medium">
                          {permission.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {permission.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
