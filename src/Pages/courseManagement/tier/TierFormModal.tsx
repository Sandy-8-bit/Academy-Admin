import { useEffect, useState } from "react";
import Input from "@/components/common/Input";
import ButtonSm from "@/components/common/Button";
import { useCreateTier, useUpdateTier } from "@/queries/tierQuery";
import type { Tier, TierPost } from "@/types/tierTypes";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  tier: Tier | null;
  courseId: string;
  onClose: () => void;
}

const TierFormModal = ({ open, mode, tier, courseId, onClose }: Props) => {
  const [form, setForm] = useState<TierPost>({
    tier_number: "",
    tier_name: "",
    description: "",
  });

  const createTier = useCreateTier(courseId);
  const updateTier = useUpdateTier();

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      // 🔥 RESET FORM
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        tier_number: "",
        tier_name: "",
        description: "",
      });
    }

    if (mode === "edit" && tier) {
      setForm({
        tier_number: String(tier.tier_number),
        tier_name: tier.tier_name,
        description: tier.description ?? "",
      });
    }
  }, [mode, tier, open]);

  if (!open) return null;

  const submit = () => {
    if (mode === "create") {
      createTier.mutate(form, { onSuccess: onClose });
    } else if (tier) {
      updateTier.mutate(
        { tierId: tier.id, courseId, payload: form },
        { onSuccess: onClose }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">
          {mode === "create" ? "Create Tier" : "Edit Tier"}
        </h2>

        <div className="space-y-4">
          <Input
            title="Tier Number"
            type="num"
            placeholder="Enter Tier Number"
            required
            inputValue={form.tier_number}
            onChange={(v) => setForm({ ...form, tier_number: String(v) })}
          />
          <Input
            title="Tier Name"
            placeholder="Enter Tier Name"
            inputValue={form.tier_name}
            required
            onChange={(v) => setForm({ ...form, tier_name: v })}
          />
          <Input
            title="Description"
            placeholder="Enter Description"
            inputValue={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <ButtonSm state="outline" onClick={onClose}>
            Cancel
          </ButtonSm>
          <ButtonSm
            state="default"
            onClick={submit}
            isPending={createTier.isPending || updateTier.isPending}
          >
            Save
          </ButtonSm>
        </div>
      </div>
    </div>
  );
};

export default TierFormModal;
