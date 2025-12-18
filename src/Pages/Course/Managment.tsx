import { useNavigate } from "react-router-dom";
import { BookOpen, Layers, Video, ArrowRight } from "lucide-react";

export const Management = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Course Creation",
      description: "Create, edit and manage courses",
      icon: BookOpen,
      route: "/management/course",
    },
    {
      title: "Module Creation",
      description: "Structure and organize course modules",
      icon: Layers,
      route: "/management/module",
    },
    {
      title: "Content Creation",
      description: "Upload videos and learning materials",
      icon: Video,
      route: "/management/content",
    },
  ];

  return (
    <div className="min-h-screen  p-3">
      <div className="">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                onClick={() => navigate(card.route)}
                className="
                  group
                  relative
                  bg-white
                  rounded-2xl
                  p-8
                  cursor-pointer
                  border border-slate-200
                  transition-all duration-300
                  hover:shadow-xl
                  hover:border-blue-300
                  hover:-translate-y-1
                "
              >
                {/* Icon Container */}
                <div
                  className="
                    w-12 h-12
                    flex items-center justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-900
                    mb-4
                    transition-all duration-300
                    group-hover:bg-blue-900
                    group-hover:text-white
                    group-hover:scale-110
                  "
                >
                  <Icon size={24} strokeWidth={2} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {card.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Arrow Indicator */}
                <div className="flex items-center gap-1 text-sm font-medium text-blue-900 group-hover:gap-2 transition-all">
                  <span>Get Started</span>
                  <ArrowRight
                    size={16}
                    strokeWidth={2.5}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>

                {/* Subtle Gradient Overlay on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};