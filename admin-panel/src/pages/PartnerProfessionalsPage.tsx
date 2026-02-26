import React, { useState, useEffect } from "react";
import { NavigationProps, Professional, ProfessionalStatus } from "../types";
import { partnerService } from "../services/api";

export const PartnerProfessionalsPage: React.FC<NavigationProps> = ({
  admin,
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProfessionals = async () => {
    if (admin?.partnerId) {
      try {
        setLoading(true);
        const data = await partnerService.getProfessionals(admin.partnerId);
        setProfessionals(data);
      } catch (error) {
        console.error("Failed to fetch professionals:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [admin?.partnerId]);

  const getStatusColor = (status: ProfessionalStatus) => {
    switch (status) {
      case ProfessionalStatus.ACTIVE:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case ProfessionalStatus.ONBOARDING:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case ProfessionalStatus.SUSPENDED:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredProfessionals = professionals.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm),
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            My Professionals
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your fleet of service professionals
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Onboard Professional
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search professionals by name or phone..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:outline-none focus:border-primary font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            Loading professionals...
          </div>
        ) : filteredProfessionals.length > 0 ? (
          filteredProfessionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                    {professional.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">
                      {professional.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {professional.phone}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${getStatusColor(professional.status)}`}
                >
                  {professional.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50 dark:border-gray-700 mt-2">
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">
                    Rating
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-yellow-400">
                      star
                    </span>
                    <span className="font-bold text-sm">
                      {professional.rating || "N/A"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">
                    Jobs Done
                  </p>
                  <p className="font-bold text-sm">
                    {professional.completedJobs || 0}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-gray-700 mt-2">
                <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                  Details{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            No professionals found
          </div>
        )}
      </div>
    </div>
  );
};
