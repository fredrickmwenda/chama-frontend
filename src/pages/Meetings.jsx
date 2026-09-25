// src/pages/Meetings.jsx
import { useEffect, useState } from 'react';
import api from '../api/api'; // Adjust path if needed
import { useAuthContext } from '../hooks/useAuth';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import AttendanceModal from '../components/AttendanceModal';
import MeetingDetailsModal from '../components/MeetingDetailsModal'; // <-- Import Details Modal
import { 
  CalendarPlus, Loader2, CalendarDays, ChevronLeft, ChevronRight, 
  Mail, MessageSquare, Phone, X, ClipboardCheck, FileText, Eye // <-- Added Eye & FileText
} from 'lucide-react';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Modal States
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // <-- New state for details modal
  const [activeMeeting, setActiveMeeting] = useState(null);

  const canManage = user && ['Super Admin', 'Admin User', 'Secretary'].includes(user.role);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    // Mock data fetch simulating backend
    setTimeout(() => {
      setMeetings([
        // Uncomment to test past meetings
        // { id: 1, title: 'Past Meeting', date: '2024-05-15', minimum_contribution: 500, minutes: 'Discussed the new loan policy. Readings: Need to audit Q1 books.' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, (_, i) => `blank-${i}`);
    const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    return [...blanks, ...days];
  };

  const handleDateClick = (date) => {
    if (date < today) {
      // If it's a past date, check if there was a meeting
      const meetingOnDate = meetings.find(m => new Date(m.date).toDateString() === date.toDateString());
      if (meetingOnDate) {
        setActiveMeeting(meetingOnDate);
        setIsDetailsOpen(true); // Open details modal
      } else {
        toast.error("No meeting was held on this past date.");
      }
      return;
    }
    // If it's today or future, open scheduling modal
    setSelectedDate(date);
    setIsMeetingModalOpen(true);
  };

  const isMeetingOnDate = (date) => {
    return meetings.some(meet => new Date(meet.date).toDateString() === date.toDateString());
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const channels = formData.getAll('channels');
    if (channels.length === 0) return toast.error("Please select at least one communication channel.");

    try {
      toast.success(`Meeting scheduled! Notifying via: ${channels.join(', ')}`);
      setIsMeetingModalOpen(false);
    } catch (err) {
      toast.error("Failed to schedule meeting.");
    }
  };

  // Find the most recent past meeting to display its readings
  const lastMeeting = meetings
    .filter(m => new Date(m.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Meetings Calendar</h1>
        <p className="text-slate-500 mt-1">Click on a date to schedule a meeting. Click a past meeting to view minutes.</p>
      </div>

      {/* --- Last Meeting Readings Banner --- */}
      {lastMeeting && (
        <div className="card mb-8 bg-indigo-50/50 border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">Readings from Last Meeting ({formatDate(lastMeeting.date)})</h3>
              <p className="text-sm text-slate-600 mt-1">{lastMeeting.minutes || 'No minutes were recorded for this meeting.'}</p>
            </div>
            <button 
              onClick={() => { setActiveMeeting(lastMeeting); setIsDetailsOpen(true); }}
              className="btn-ghost text-xs flex items-center gap-1"
            >
              <Eye className="w-4 h-4" /> View Full Details
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
          <p>Loading calendar...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* --- Left: Calendar View --- */}
          <div className="lg:col-span-3 card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-slate-100">
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-slate-100">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs font-bold text-slate-400 uppercase py-2">{day}</div>
              ))}
              
              {renderCalendarDays().map((date, index) => {
                if (typeof date === 'string') return <div key={index} className="p-2"></div>;
                
                const isPast = date < today;
                const hasMeeting = isMeetingOnDate(date);
                const isToday = date.toDateString() === today.toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    // Removed disabled={isPast} so past meetings can be clicked!
                    className={`relative p-2 h-16 rounded-lg border transition-all flex flex-col items-center justify-center
                      ${isPast && !hasMeeting ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'}
                      ${isToday ? 'bg-indigo-50 border-indigo-200' : ''}
                      ${isPast && hasMeeting ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : ''}
                    `}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-indigo-600' : isPast && hasMeeting ? 'text-emerald-700' : 'text-slate-700'}`}>{date.getDate()}</span>
                    {hasMeeting && <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isPast ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- Right: Upcoming Meetings List --- */}
          <div className="lg:col-span-2 card flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <CalendarPlus className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-800">Upcoming</h2>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {meetings.filter(m => new Date(m.date) >= today).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 text-slate-500">
                  <CalendarDays className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="font-medium">No upcoming meetings.</p>
                  <p className="text-sm mt-1">Click a date on the calendar to add one.</p>
                </div>
              ) : (
                meetings.filter(m => new Date(m.date) >= today).map(meet => (
                  <div key={meet.id} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-slate-900">{meet.title}</p>
                        <p className="text-sm text-slate-500">{formatDate(meet.date)}</p>
                      </div>
                    </div>
                    
                    {canManage && (
                      <button 
                        onClick={() => { setActiveMeeting(meet); setIsAttendanceOpen(true); }}
                        className="btn-primary text-xs w-full mt-3"
                      >
                        <ClipboardCheck className="w-4 h-4" /> Take Attendance & Fines
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Meeting Scheduling Modal --- */}
      {isMeetingModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsMeetingModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-xl font-bold text-slate-800">Schedule Meeting</h3>
              <button onClick={() => setIsMeetingModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleScheduleMeeting} className="space-y-4 mt-4">
               {/* ... (Keep the exact form code from your previous Meetings.jsx here: Date, Title, Min Contribution, Channels) ... */}
              <div className="modal-footer">
                <button type="button" onClick={() => setIsMeetingModalOpen(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">
                  <CalendarPlus className="w-4 h-4" /> Schedule & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modals --- */}
      {isAttendanceOpen && (
        <AttendanceModal meeting={activeMeeting} onClose={() => setIsAttendanceOpen(false)} />
      )}
      
      {isDetailsOpen && (
        <MeetingDetailsModal meeting={activeMeeting} onClose={() => setIsDetailsOpen(false)} />
      )}

    </div>
  );
};

export default Meetings;