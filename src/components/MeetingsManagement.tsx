import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video,
  MapPin,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  FileText,
  Mic,
  Camera,
  Settings,
  Bell,
  Download,
  Share2
} from 'lucide-react';
import { meetingStorage, type Meeting } from '@/lib/storage';

const MeetingsManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Load meetings on component mount
  useEffect(() => {
    const loadMeetings = () => {
      const storedMeetings = meetingStorage.getAll();
      setMeetings(storedMeetings);
    };
    loadMeetings();
  }, []);

  // Handle actions with loading states
  const handleAction = (action: string, meetingId?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  };

  const meetingStats = {
    totalMeetings: meetings.length,
    todayMeetings: meetings.filter(m => m.date === new Date().toISOString().split('T')[0]).length,
    upcomingMeetings: meetings.filter(m => m.status === 'scheduled').length,
    completedMeetings: meetings.filter(m => m.status === 'completed').length
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-primary/10 text-primary border-primary/20';
      case 'in-progress': return 'bg-accent/10 text-accent border-accent/20';
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || meeting.date === selectedDate;
    const matchesType = selectedType === 'all' || meeting.type === selectedType;
    
    return matchesSearch && matchesDate && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      case 'hybrid': return <Users className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-muted/10 text-muted-foreground border-muted/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const CreateMeetingDialog = () => (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule New Meeting
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Title</label>
              <Input placeholder="Enter meeting title" className="neu-inset" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Type</label>
              <select className="w-full px-3 py-2 rounded-lg neu-inset bg-background border-0">
                <option value="video">Video Call</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" className="neu-inset" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input type="time" className="neu-inset" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input type="number" placeholder="60" className="neu-inset" />
            </div>
          </div>

          {/* Description & Location */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                placeholder="Meeting description..."
                className="w-full px-3 py-2 rounded-lg neu-inset bg-background border-0 min-h-[80px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location / Meeting Link</label>
              <Input placeholder="Conference room or video link" className="neu-inset" />
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Attendees</label>
            <Input placeholder="Enter email addresses separated by commas" className="neu-inset" />
          </div>

          {/* Agenda */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Agenda Items</label>
            <div className="space-y-2">
              <Input placeholder="Agenda item 1" className="neu-inset" />
              <Input placeholder="Agenda item 2" className="neu-inset" />
              <Button variant="outline" size="sm" className="hover-lift">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <select className="w-full px-3 py-2 rounded-lg neu-inset bg-background border-0">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="neu-primary" 
              className="hover-glow"
              onClick={() => {
                handleAction('create');
                setShowCreateDialog(false);
              }}
            >
              <Calendar className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const MeetingDetailsDialog = () => (
    <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
      <DialogContent className="max-w-2xl">
        {selectedMeeting && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTypeIcon(selectedMeeting.type)}
                {selectedMeeting.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 p-6">
              {/* Meeting Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{selectedMeeting.date} at {selectedMeeting.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedMeeting.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedMeeting.location}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{selectedMeeting.description}</p>
              </div>

              {/* Attendees */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Attendees ({selectedMeeting.attendees.length})</p>
                <div className="flex flex-wrap gap-1">
                  {selectedMeeting.attendees.map((attendee, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {attendee}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Agenda */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Agenda</p>
                <ul className="space-y-1">
                  {selectedMeeting.agenda.map((item, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary font-medium">{index + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meeting Link */}
              {selectedMeeting.meetingLink && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Meeting Link</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1">{selectedMeeting.meetingLink}</code>
                    <Button size="sm" variant="outline" className="hover-lift">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(selectedMeeting.status)}>
                    {selectedMeeting.status}
                  </Badge>
                  <Badge className={getPriorityColor(selectedMeeting.priority)}>
                    {selectedMeeting.priority} priority
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {selectedMeeting.status === 'scheduled' && (
                    <Button 
                      variant="neu-primary" 
                      className="hover-glow"
                      onClick={() => handleAction('join', selectedMeeting.id)}
                    >
                      <Video className="h-4 w-4" />
                      Join Meeting
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => handleAction('edit', selectedMeeting.id)}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-accent text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-down">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Meeting action completed successfully!
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-card p-8 rounded-2xl shadow-2xl animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Processing meeting...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Meetings Management
          </h1>
          <p className="text-muted-foreground">Schedule, conduct, and manage team meetings</p>
        </div>
        
        <div className="flex gap-3 animate-fade-in-right">
          <Button 
            variant="outline" 
            className="hover-lift group"
            onClick={() => handleAction('export')}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 group-hover:animate-bounce-in" />
            Export Calendar
          </Button>
          <Button 
            variant="neu-primary" 
            className="hover-glow group"
            onClick={() => setShowCreateDialog(true)}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 group-hover:animate-bounce-in" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'total')}
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Total Meetings</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{meetingStats.totalMeetings}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'today')}
        >
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-accent group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">Today</p>
              <p className="text-2xl font-bold text-accent group-hover:scale-105 transition-transform">{meetingStats.todayMeetings}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'upcoming')}
        >
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-warning group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-warning transition-colors">Upcoming</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{meetingStats.upcomingMeetings}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'completed')}
        >
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600 group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-green-600 transition-colors">Completed</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{meetingStats.completedMeetings}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="neu-surface p-6 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neu-inset focus:shadow-lg transition-all duration-300"
            />
          </div>
          
          <div className="flex gap-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="neu-inset hover-lift"
            />
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-lg neu-inset hover-lift transition-all duration-300 bg-background border-0"
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="in-person">In-Person</option>
              <option value="hybrid">Hybrid</option>
            </select>
            
            <Button 
              variant="outline" 
              size="icon"
              className="hover-scale group"
              onClick={() => handleAction('filter')}
              disabled={isLoading}
            >
              <Filter className="h-4 w-4 group-hover:animate-bounce-in" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Meetings List */}
      <div className="grid grid-cols-1 gap-4 animate-fade-in-up" style={{animationDelay: '400ms'}}>
        {meetings.map((meeting, index) => (
          <Card 
            key={meeting.id} 
            className="neu-surface p-6 hover-lift group cursor-pointer stagger-item"
            style={{animationDelay: `${500 + index * 100}ms`}}
            onClick={() => setSelectedMeeting(meeting)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getTypeIcon(meeting.type)}
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {meeting.title}
                  </h3>
                  <Badge className={getPriorityColor(meeting.priority)}>
                    {meeting.priority}
                  </Badge>
                  <Badge className={getStatusColor(meeting.status)}>
                    {meeting.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{meeting.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.time} ({meeting.duration}m)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.attendees.length} attendees</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {meeting.status === 'scheduled' && (
                  <Button 
                    variant="neu-primary" 
                    size="sm"
                    className="hover-glow group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('join', meeting.id);
                    }}
                    disabled={isLoading}
                  >
                    <Video className="h-4 w-4 group-hover:animate-bounce-in" />
                    Join
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover-scale group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('edit', meeting.id);
                  }}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4 group-hover:animate-bounce-in" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover-scale group text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('delete', meeting.id);
                  }}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 group-hover:animate-bounce-in" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{animationDelay: '500ms'}}>
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('instant-meeting')}
        >
          <div className="flex items-center gap-4">
            <Video className="h-12 w-12 text-primary group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">Start Instant Meeting</h3>
              <p className="text-sm text-muted-foreground">Begin an impromptu video call</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('meeting-rooms')}
        >
          <div className="flex items-center gap-4">
            <MapPin className="h-12 w-12 text-accent group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-accent transition-colors">Book Meeting Room</h3>
              <p className="text-sm text-muted-foreground">Reserve physical meeting spaces</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('meeting-templates')}
        >
          <div className="flex items-center gap-4">
            <FileText className="h-12 w-12 text-warning group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-warning transition-colors">Meeting Templates</h3>
              <p className="text-sm text-muted-foreground">Use predefined meeting formats</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Dialogs */}
      <CreateMeetingDialog />
      <MeetingDetailsDialog />
    </div>
  );
};

export default MeetingsManagement;
