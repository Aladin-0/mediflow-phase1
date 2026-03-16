'use client';

import { useState } from 'react';
import {
    Plus, Edit2, Building2, Phone, Mail, MapPin,
    FileText, CreditCard, CheckCircle2, AlertCircle,
    X, Save, ChevronDown, BookOpen,
} from 'lucide-react';
import { LedgerDrawer } from '@/components/accounts/LedgerDrawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useDistributors, useCreateDistributor, useUpdateDistributor } from '@/hooks/usePurchases';
import { useAuthStore } from '@/store/authStore';
import { Distributor, INDIAN_STATES } from '@/types';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatINR = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const AVATAR_COLORS = [
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
];

function avatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string) {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

type FormState = Partial<Distributor>;

const defaultForm = (): FormState => ({
    name: '',
    gstin: '',
    drugLicenseNo: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    creditDays: 30,
    openingBalance: 0,
    balanceType: 'CR',
});

// ─── Form Component ───────────────────────────────────────────────────────────

function DistributorForm({
    initial,
    onSave,
    onCancel,
    isSaving,
    title,
}: {
    initial: FormState;
    onSave: (f: FormState) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
    title: string;
}) {
    const [form, setForm] = useState<FormState>(initial);
    const set = (field: keyof FormState, value: string | number) =>
        setForm((p) => ({ ...p, [field]: value }));

    return (
        <Card className="border-blue-200 shadow-sm">
            <CardHeader className="pb-4 pt-5 px-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Building2 className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-base">{title}</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-slate-600"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="px-6 py-5 space-y-6">

                {/* Business Info */}
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Business Info
                    </p>
                    <div className="space-y-1.5">
                        <Label className="text-sm">
                            Company Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            autoFocus
                            value={form.name ?? ''}
                            onChange={(e) => set('name', e.target.value)}
                            placeholder="e.g. Ajanta Pharma Distributors"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm">GSTIN</Label>
                            <Input
                                value={form.gstin ?? ''}
                                onChange={(e) => set('gstin', e.target.value.toUpperCase())}
                                placeholder="27AABCA1234A1Z5"
                                className="font-mono text-xs"
                                maxLength={15}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm">Drug License No</Label>
                            <Input
                                value={form.drugLicenseNo ?? ''}
                                onChange={(e) => set('drugLicenseNo', e.target.value)}
                                placeholder="MH/DL/…"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Contact */}
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Contact
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm">
                                Phone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="tel"
                                value={form.phone ?? ''}
                                onChange={(e) => set('phone', e.target.value)}
                                placeholder="98765 43210"
                                maxLength={10}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm">Email</Label>
                            <Input
                                type="email"
                                value={form.email ?? ''}
                                onChange={(e) => set('email', e.target.value)}
                                placeholder="contact@dist.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm">Address</Label>
                        <Input
                            value={form.address ?? ''}
                            onChange={(e) => set('address', e.target.value)}
                            placeholder="Street / Area"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm">City</Label>
                            <Input
                                value={form.city ?? ''}
                                onChange={(e) => set('city', e.target.value)}
                                placeholder="Aurangabad"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm">State</Label>
                            <Select
                                value={form.state ?? 'Maharashtra'}
                                onValueChange={(v) => set('state', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {INDIAN_STATES.map((s) => (
                                        <SelectItem key={s.code} value={s.name}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Financial */}
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Financial
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm">Credit Days</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.creditDays ?? 30}
                                    onChange={(e) => set('creditDays', parseInt(e.target.value) || 0)}
                                    className="pr-12"
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                    days
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm">Opening Balance</Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                    ₹
                                </span>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={form.openingBalance ?? 0}
                                    onChange={(e) => set('openingBalance', parseFloat(e.target.value) || 0)}
                                    className="pl-6"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm">Balance Type</Label>
                            <Select
                                value={form.balanceType ?? 'CR'}
                                onValueChange={(v) => set('balanceType', v as 'CR' | 'DR')}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CR">CR — You owe them</SelectItem>
                                    <SelectItem value="DR">DR — They owe you</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 gap-2"
                        onClick={() => onSave(form)}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Save className="h-3.5 w-3.5" />
                                {title}
                            </>
                        )}
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}

// ─── Distributor Card ─────────────────────────────────────────────────────────

function DistributorCard({
    distributor: d,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    isSaving,
    onViewLedger,
}: {
    distributor: Distributor;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (f: FormState) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
    onViewLedger: () => void;
}) {
    const outstanding = d.openingBalance ?? 0;
    const cleared     = outstanding <= 0;
    const color       = avatarColor(d.name);

    if (isEditing) {
        return (
            <DistributorForm
                initial={{ ...d }}
                onSave={onSave}
                onCancel={onCancel}
                isSaving={isSaving}
                title="Update Distributor"
            />
        );
    }

    return (
        <Card className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">

                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                            color,
                        )}>
                            {initials(d.name)}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-semibold leading-tight">{d.name}</p>
                            {d.gstin && (
                                <p className="truncate font-mono text-[11px] text-muted-foreground">
                                    {d.gstin}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={onViewLedger}
                            title="View Ledger"
                        >
                            <BookOpen className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={onEdit}
                            title="Edit"
                        >
                            <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Info */}
                <div className="mb-3 space-y-1.5">
                    {d.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{d.phone}</span>
                        </div>
                    )}
                    {d.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{d.email}</span>
                        </div>
                    )}
                    {(d.city || d.state) && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                                {[d.city, d.state].filter(Boolean).join(', ')}
                            </span>
                        </div>
                    )}
                    {d.drugLicenseNo && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <FileText className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate font-mono">DL: {d.drugLicenseNo}</span>
                        </div>
                    )}
                    {d.creditDays != null && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CreditCard className="h-3.5 w-3.5 shrink-0" />
                            <span>{d.creditDays} day credit</span>
                        </div>
                    )}
                </div>

                <Separator className="my-3" />

                <div className={cn(
                    'flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold',
                    cleared ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
                )}>
                    {cleared
                        ? <CheckCircle2 className="h-3.5 w-3.5" />
                        : <AlertCircle  className="h-3.5 w-3.5" />
                    }
                    {cleared ? 'No outstanding' : `Due: ${formatINR(outstanding)}`}
                </div>

            </CardContent>
        </Card>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DistributorsTab() {
    const { toast }  = useToast();
    const outletId   = useAuthStore((s) => s.user?.outletId ?? '');

    const { data: distributors, isLoading } = useDistributors();
    const createDist = useCreateDistributor();
    const updateDist = useUpdateDistributor();

    // 'add' | distributor.id | null
    const [activeForm, setActiveForm] = useState<string | null>(null);

    const [ledgerState, setLedgerState] = useState<{
        open: boolean;
        distributorId: string;
        distributorName: string;
    }>({ open: false, distributorId: '', distributorName: '' });

    const isSaving = createDist.isPending || updateDist.isPending;

    const handleCreate = async (form: FormState) => {
        if (!form.name?.trim() || !form.phone?.trim()) {
            toast({ variant: 'destructive', title: 'Name and phone are required' });
            return;
        }
        try {
            await createDist.mutateAsync({ ...form, outletId } as any);
            toast({ title: 'Distributor added ✓' });
            setActiveForm(null);
        } catch {
            toast({ variant: 'destructive', title: 'Failed to save' });
        }
    };

    const handleUpdate = async (id: string, form: FormState) => {
        if (!form.name?.trim() || !form.phone?.trim()) {
            toast({ variant: 'destructive', title: 'Name and phone are required' });
            return;
        }
        try {
            await updateDist.mutateAsync({ id, payload: { ...form, outletId } });
            toast({ title: 'Distributor updated ✓' });
            setActiveForm(null);
        } catch {
            toast({ variant: 'destructive', title: 'Failed to update' });
        }
    };

    const totalOutstanding = (distributors ?? []).reduce(
        (sum, d) => sum + (d.openingBalance ?? 0), 0,
    );

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium">
                        {distributors?.length ?? 0} distributor{(distributors?.length ?? 0) !== 1 ? 's' : ''}
                    </p>
                    {totalOutstanding > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Total outstanding:{' '}
                            <span className="font-semibold text-red-600">
                                {formatINR(totalOutstanding)}
                            </span>
                        </p>
                    )}
                </div>

                {activeForm !== 'add' && (
                    <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setActiveForm('add')}
                    >
                        <Plus className="h-4 w-4" />
                        Add Distributor
                    </Button>
                )}
            </div>

            {/* Inline Add Form — appears at top when active */}
            {activeForm === 'add' && (
                <DistributorForm
                    initial={defaultForm()}
                    onSave={handleCreate}
                    onCancel={() => setActiveForm(null)}
                    isSaving={isSaving}
                    title="Add Distributor"
                />
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="space-y-3 p-5">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-1.5">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="mt-2 h-6 w-28" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

            /* Empty */
            ) : !distributors?.length && activeForm !== 'add' ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-semibold">No distributors yet</h3>
                    <p className="mb-5 mt-1 text-sm text-muted-foreground">
                        Add your first distributor to start recording purchases.
                    </p>
                    <Button size="sm" onClick={() => setActiveForm('add')} className="gap-1.5">
                        <Plus className="h-4 w-4" />
                        Add Distributor
                    </Button>
                </div>

            /* Cards grid */
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {(distributors ?? []).map((d: Distributor) => (
                        <DistributorCard
                            key={d.id}
                            distributor={d}
                            isEditing={activeForm === d.id}
                            onEdit={() => setActiveForm(d.id)}
                            onSave={(form) => handleUpdate(d.id, form)}
                            onCancel={() => setActiveForm(null)}
                            isSaving={isSaving}
                            onViewLedger={() => setLedgerState({ open: true, distributorId: d.id, distributorName: d.name })}
                        />
                    ))}
                </div>
            )}

            {/* Ledger Drawer */}
            <LedgerDrawer
                entityType="distributor"
                entityId={ledgerState.distributorId}
                entityName={ledgerState.distributorName}
                open={ledgerState.open}
                onClose={() => setLedgerState((s) => ({ ...s, open: false }))}
            />

        </div>
    );
}
