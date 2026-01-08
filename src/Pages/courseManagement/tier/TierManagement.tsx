import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Edit3, Trash2, Blocks } from "lucide-react";

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
      <div className="absolute right-3 top-10 z-20 w-44 rounded-md border border-[#d1d3d9]  overflow-hidden bg-white shadow-lg">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(tier);
            setActiveMenuId(null);
          }}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#1f2937] hover:bg-[#f3f4f6] transition-colors"
        >
          <Edit3 size={14} className="text-[#6b7280]" /> Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTierToDelete(tier);
            setActiveMenuId(null);
          }}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#d1d3d9]  px-6 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ButtonSm
              state="outline"
              onClick={() => navigate(-1)}
              className="bg-transparent border-none !px-0 !py-0 "
            >
              <ArrowLeft size={20} />
            </ButtonSm>
            <h1 className="text-md font-medium text-[#1f2937]">Course Tiers</h1>
          </div>
          <ButtonSm
            type="button"
            state="default"
            onClick={openCreateModal}
            className="text-sm font-medium "
          >
            <Blocks className="h-4 w-4" />
            Create New Tier
          </ButtonSm>
        </div>
      </header>

      {/* Content */}
      <section className="p-6">
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-sm text-[#6b7280]">Loading tiers...</div>
          </div>
        )}

        {!isLoading && tiers.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#d1d3d9]  bg-white py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f3f4f6] mb-4">
              <Blocks size={32} className="text-[#9ca3af]" />
            </div>
            <h3 className="text-base font-semibold text-[#1f2937] mb-1">
              No tiers found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[#6b7280] mb-4">
              This course doesn't have any tiers yet. Create one to organize
              your content.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              <Blocks size={16} /> Create New Tier
            </button>
          </div>
        )}

        {!isLoading && tiers.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.id}
                className="group relative rounded-lg border border-[#d1d3d9]  bg-white p-5 transition-all hover:border-gray-300 cursor-pointer"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === tier.id ? null : tier.id);
                  }}
                  className="absolute cursor-pointer right-3 top-3 rounded-md p-1.5 text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#1f2937] transition-colors"
                >
                  <MoreVertical size={16} />
                </button>

                {renderMenu(tier)}

                <div className="mb-3">
                  <span className="inline-block rounded-md bg-[#dbeafe] px-2.5 py-1 text-xs font-semibold text-[#1e40af]">
                    Tier {tier.tier_number}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#1f2937] mb-2">
                  {tier.tier_name}
                </h3>

                <p className="line-clamp-2 text-sm text-[#6b7280] mb-4">
                  {tier.description || "No description provided"}
                </p>

                <div className="border-t border-[#d1d3d9]  pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9ca3af] uppercase tracking-wide">
                      Content
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${courseId}/tier/${tier.id}`);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#f3f4f6] px-3 py-1.5 text-xs font-medium text-[#1f2937] hover:bg-[#e5e7eb] transition-colors"
                    >
                      Manage Content →
                    </button>
                  </div>
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
    </div>
  );
};

export default TierManagement;
