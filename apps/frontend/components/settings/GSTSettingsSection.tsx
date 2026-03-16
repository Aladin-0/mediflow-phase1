'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useSettingsStore } from '@/store/settingsStore';
import { useToast } from '@/hooks/use-toast';
import { gstSettingsSchema, type GSTSettingsFormValues } from '@/lib/validations/settings';
import { INDIAN_STATES } from '@/types';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { SettingsToggleRow } from './SettingsToggleRow';
import { cn } from '@/lib/utils';

const GST_RATES = [0, 5, 12, 18, 28];

interface GSTSettingsSectionProps {
    onDirty: () => void;
    onSaved: () => void;
    discardKey?: number;
}

export function GSTSettingsSection({ onDirty, onSaved, discardKey }: GSTSettingsSectionProps) {
    const store = useSettingsStore();
    const { toast } = useToast();

    const getDefaults = (): GSTSettingsFormValues => ({
        gstType: store.gstType,
        enableGST: store.enableGST,
        defaultGSTRate: store.defaultGSTRate,
        roundOffInvoice: store.roundOffInvoice,
        showGSTBreakup: store.showGSTBreakup,
        outletStateCode: store.outletStateCode,
    });

    const { control, handleSubmit, watch, setValue, reset, formState: { isDirty } } =
        useForm<GSTSettingsFormValues>({
            resolver: zodResolver(gstSettingsSchema),
            defaultValues: getDefaults(),
        });

    useEffect(() => {
        if (discardKey !== undefined) reset(getDefaults());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [discardKey]);

    useEffect(() => {
        if (isDirty) onDirty();
    }, [isDirty, onDirty]);

    const gstType = watch('gstType');
    const enableGST = watch('enableGST');
    const defaultGSTRate = watch('defaultGSTRate');
    const outletStateCode = watch('outletStateCode');

    // Sample calculation
    const sampleMRP = 38;
    const sampleRate = 32;
    const qty = 2;
    const taxableRaw = sampleRate * qty;
    const taxable = taxableRaw / (1 + defaultGSTRate / 100);
    const gstAmount = taxableRaw - taxable;
    const halfGST = gstAmount / 2;

    function onSubmit(data: GSTSettingsFormValues) {
        store.updateGSTSettings(data);
        toast({ title: 'GST settings saved' });
        onSaved();
        reset(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <SettingsSectionHeader
                icon={<FileText />}
                title="GST & Tax Settings"
                description="Configure how GST is calculated and displayed on invoices."
            />

            {/* GST Type */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div>
                    <Label className="text-sm font-medium">GST Type</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Select based on your state registration</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {(['intrastate', 'interstate'] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setValue('gstType', type, { shouldDirty: true })}
                            className={cn(
                                'border-2 rounded-xl p-4 text-left transition-colors',
                                gstType === type
                                    ? 'border-primary bg-primary/5'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                            )}
                        >
                            <p className="text-sm font-semibold text-slate-900">
                                {type === 'intrastate' ? 'Intrastate (CGST + SGST)' : 'Interstate (IGST)'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {type === 'intrastate'
                                    ? `For sales within Maharashtra · CGST: ${defaultGSTRate / 2}% + SGST: ${defaultGSTRate / 2}%`
                                    : `For sales to other states · IGST: ${defaultGSTRate}% total`
                                }
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* State Code */}
            <div className="space-y-1.5">
                <Label>Your State GST Code</Label>
                <Controller
                    control={control}
                    name="outletStateCode"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                            <SelectTrigger className="w-full max-w-xs">
                                <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                                {INDIAN_STATES.map((s) => (
                                    <SelectItem key={s.code} value={s.code}>
                                        {s.code} — {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-xs text-muted-foreground">First 2 digits of your GSTIN</p>
            </div>

            {/* GST Toggles */}
            <div className="rounded-xl border bg-white divide-y">
                <div className="p-4">
                    <SettingsToggleRow
                        label="Enable GST"
                        description="If OFF, no GST will be added to bills"
                        checked={enableGST}
                        onCheckedChange={(v) => setValue('enableGST', v, { shouldDirty: true })}
                        warningMessage="Disabling GST may affect compliance. Ensure you are exempt before turning this off."
                        className="border-b-0"
                    />
                    {!enableGST && (
                        <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">Disabling GST may affect compliance</p>
                        </div>
                    )}
                </div>
                <div className="px-4">
                    <SettingsToggleRow
                        label="Round off invoice total"
                        description="Rounds grand total to nearest rupee"
                        checked={watch('roundOffInvoice')}
                        onCheckedChange={(v) => setValue('roundOffInvoice', v, { shouldDirty: true })}
                        className="border-b-0"
                    />
                </div>
                <div className="px-4">
                    <SettingsToggleRow
                        label="Show GST breakup on invoice"
                        description="Displays CGST/SGST split on printed invoice"
                        checked={watch('showGSTBreakup')}
                        onCheckedChange={(v) => setValue('showGSTBreakup', v, { shouldDirty: true })}
                        className="border-b-0"
                    />
                </div>
            </div>

            {/* Default GST Rate */}
            <div className="space-y-1.5">
                <Label>Default GST Rate for new products</Label>
                <Controller
                    control={control}
                    name="defaultGSTRate"
                    render={({ field }) => (
                        <Select
                            value={String(field.value)}
                            onValueChange={(val) => field.onChange(Number(val))}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {GST_RATES.map((r) => (
                                    <SelectItem key={r} value={String(r)}>{r}%</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    Applied when adding a product without a specified rate
                </p>
            </div>

            {/* GST Calculation Preview */}
            {enableGST && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                        Sample Calculation
                    </p>
                    <div className="text-sm space-y-1">
                        <p className="text-slate-600">Metformin 500mg × 2 strips</p>
                        <p className="text-xs text-muted-foreground">MRP: ₹{sampleMRP} | Rate: ₹{sampleRate}</p>
                    </div>
                    <div className="border-t pt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Taxable Amount</span>
                            <span className="font-mono">₹{taxable.toFixed(2)}</span>
                        </div>
                        {gstType === 'intrastate' ? (
                            <>
                                <div className="flex justify-between text-slate-500">
                                    <span>CGST @ {defaultGSTRate / 2}%</span>
                                    <span className="font-mono">₹{halfGST.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>SGST @ {defaultGSTRate / 2}%</span>
                                    <span className="font-mono">₹{halfGST.toFixed(2)}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-between text-slate-500">
                                <span>IGST @ {defaultGSTRate}%</span>
                                <span className="font-mono">₹{gstAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Total</span>
                            <span className="font-mono">₹{(taxableRaw).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            <Button type="submit" className="w-full sm:w-auto">
                Save GST Settings
            </Button>
        </form>
    );
}
