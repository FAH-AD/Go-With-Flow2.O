import React from "react";

function FreelancerStats({ freelancer }) {
    return(
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Earnings Card */}
                  <div className="bg-[#121218] p-6 rounded-lg border border-[#2d2d3a] hover:border-[#9333EA]/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Total Earnings</p>
                        <h3 className="text-2xl font-bold mt-1">${stats.earnings.total.toLocaleString()}</h3>
                        <div className="flex items-center mt-2 text-green-400 text-sm">
                          <TrendingUp size={14} className="mr-1" />
                          <span>+12% from last month</span>
                        </div>
                      </div>
                      <div className="bg-[#9333EA]/20 p-3 rounded-lg">
                        <DollarSign size={24} className="text-[#9333EA]" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#2d2d3a] grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-gray-400 text-xs">This Month</p>
                        <p className="font-medium">${stats.earnings.thisMonth.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Pending</p>
                        <p className="font-medium">${stats.earnings.pending.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
        
                  {/* Jobs Stats Card */}
                  <div className="bg-[#121218] p-6 rounded-lg border border-[#2d2d3a] hover:border-[#9333EA]/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Jobs</p>
                        <h3 className="text-2xl font-bold mt-1">{stats.jobs.completed + stats.jobs.active}</h3>
                        <div className="flex items-center mt-2 text-[#9333EA] text-sm">
                          <Star size={14} className="mr-1" />
                          <span>98% Success Rate</span>
                        </div>
                      </div>
                      <div className="bg-[#9333EA]/20 p-3 rounded-lg">
                        <Briefcase size={24} className="text-[#9333EA]" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#2d2d3a] grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-gray-400 text-xs">Completed</p>
                        <p className="font-medium">{stats.jobs.completed}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Active</p>
                        <p className="font-medium">{stats.jobs.active}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Proposals</p>
                        <p className="font-medium">{stats.jobs.proposals}</p>
                      </div>
                    </div>
                  </div>
        
                  {/* Profile Views Card */}
                  <div className="bg-[#121218] p-6 rounded-lg border border-[#2d2d3a] hover:border-[#9333EA]/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Profile Views</p>
                        <h3 className="text-2xl font-bold mt-1">{stats.profileViews}</h3>
                        <div className="flex items-center mt-2 text-green-400 text-sm">
                          <ArrowUpRight size={14} className="mr-1" />
                          <span>+28% from last week</span>
                        </div>
                      </div>
                      <div className="bg-[#9333EA]/20 p-3 rounded-lg">
                        <Users size={24} className="text-[#9333EA]" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#2d2d3a]">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-xs">Profile Completeness</p>
                        <p className="text-xs font-medium">{stats.profileCompleteness}%</p>
                      </div>
                      <div className="w-full h-2 bg-[#2d2d3a] rounded-full mt-2">
                        <div
                          className="h-full bg-[#9333EA] rounded-full"
                          style={{ width: `${stats.profileCompleteness}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
        
                  {/* Availability Card */}
                  <div className="bg-[#121218] p-6 rounded-lg border border-[#2d2d3a] hover:border-[#9333EA]/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Availability</p>
                        <h3 className="text-2xl font-bold mt-1">20 hrs/week</h3>
                        <div className="flex items-center mt-2 text-[#9333EA] text-sm">
                          <Calendar size={14} className="mr-1" />
                          <span>Update Availability</span>
                        </div>
                      </div>
                      <div className="bg-[#9333EA]/20 p-3 rounded-lg">
                        <Clock size={24} className="text-[#9333EA]" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#2d2d3a]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell size={14} className="mr-2 text-[#9333EA]" />
                          <p className="text-sm">Unread Messages</p>
                        </div>
                        <div className="bg-[#9333EA] text-white text-xs font-bold px-2 py-1 rounded-full">
                          {stats.unreadMessages}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        
    )
}
export default FreelancerStats;