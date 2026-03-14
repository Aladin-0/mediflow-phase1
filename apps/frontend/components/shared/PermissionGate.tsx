'use client';

import { usePermissions, type Permission } from '@/hooks/usePermissions';
import React from 'react';

interface PermissionGateProps {
    permission: Permission;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function PermissionGate({
    permission,
    children,
    fallback = null,
}: PermissionGateProps) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
