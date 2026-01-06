import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Edit3, Trash2, Layers } from "lucide-react";

import { useFetchTiersByCourse, useDeleteTier } from "@/queries/tierQuery";
import type { Tier } from "@/types/tierTypes";

import TierFormModal from "./TierFormModal";
import ConfirmDeletePopup from "@components/common/ConfirmDeletePopup";
import ButtonSm from "@/components/common/Button";

const TierManagement = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [tierToDelete, setTierToDelete] = useState<Tier | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const { data, isLoading } = useFetchTiersByCourse(courseId!);
  const { mutate: deleteTier, isPending: isDeleting } = useDeleteTier(
    courseId!
  );

  // ✅ SAFE fallback
  const tiers = data?.tiers ?? [];

  useEffect(() => {
    if (!activeMenuId) return;
    const close = () => setActiveMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [activeMenuId]);

  const openCreateModal = () => {
    setSelectedTier(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEditModal = (tier: Tier) => {
    setModalMode("edit");
    setSelectedTier(tier);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (!tierToDelete) return;
    deleteTier(tierToDelete.id, {
      onSettled: () => setTierToDelete(null),
    });
  };

  const renderMenu = (tier: Tier) =>
    activeMenuId === tier.id && (
      <div className="absolute right-3 top-10 z-20 w-44 rounded-md border overflow-clip bg-white shadow-lg">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(tier);
            setActiveMenuId(null);
          }}
          className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-slate-50"
        >
          <Edit3 size={14} /> Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTierToDelete(tier);
            setActiveMenuId(null);
          }}
          className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    );

  return (
    <main className="layout-container m-4 min-h-[95vh] rounded-[12px] border-2 border-[#F1F1F1] bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />
          Course Tiers
        </h1>

        <ButtonSm state="default" onClick={openCreateModal}>
          <Layers size={16} /> Create New Tier
        </ButtonSm>
      </header>
      <div className="divider min-w-full border border-[#F1F1F1]" />
      {/* Content */}
      <section className="p-4">
        {isLoading && <p>Loading tiers...</p>}

        {!isLoading && tiers.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
            <Layers size={42} className="mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800">
              No tiers found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              This course doesn’t have any tiers yet. Create one to organize
              your content.
            </p>
          </div>
        )}

        {!isLoading && tiers.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.id}
                className="group relative rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-slate-300"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === tier.id ? null : tier.id);
                  }}
                  className="absolute cursor-pointer right-3 top-3 rounded-md p-1 text-slate-500 hover:bg-slate-100"
                >
                  <MoreVertical size={16} />
                </button>

                {renderMenu(tier)}

                <span className="mb-2 inline-block rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                  Tier {tier.tier_number}
                </span>

                <h3 className="text-lg font-semibold text-slate-900">
                  {tier.tier_name}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {tier.description || "No description provided"}
                </p>

                <div className="my-4 h-px bg-slate-100" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Manage tier content
                  </span>
                  <ButtonSm
                    state="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${courseId}/tiers/${tier.id}`);
                    }}
                  >
                    Add Content
                  </ButtonSm>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <TierFormModal
        open={modalOpen}
        mode={modalMode}
        tier={selectedTier}
        courseId={courseId!}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDeletePopup
        open={!!tierToDelete}
        title="Delete tier?"
        description={`Delete "${tierToDelete?.tier_name}" permanently?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setTierToDelete(null)}
      />
    </main>
  );
};

export default TierManagement;
