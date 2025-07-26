import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  UserPlus, 
  Briefcase, 
  Calendar, 
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Clock,
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Send
} from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'intern';
  salary: string;
  posted: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  applicants: number;
  description: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string;
  resume: string;
}

const RecruitmentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [showJobForm, setShowJobForm] = useState(false);

  const jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote / San Francisco',
      type: 'full-time',
      salary: '$120,000 - $150,000',
      posted: '2024-01-15',
      deadline: '2024-02-15',
      status: 'active',
      applicants: 24,
      description: 'We are looking for an experienced frontend developer...'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York',
      type: 'full-time',
      salary: '$130,000 - $160,000',
      posted: '2024-01-10',
      deadline: '2024-02-10',
      status: 'active',
      applicants: 18,
      description: 'Join our product team to drive innovation...'
    },
    {
      id: '3',
      title: 'UX Designer Intern',
      department: 'Design',
      location: 'Remote',
      type: 'intern',
      salary: '$25/hour',
      posted: '2024-01-05',
      deadline: '2024-01-25',
      status: 'closed',
      applicants: 45,
      description: 'Summer internship opportunity for UX design students...'
    }
  ];

  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Frontend Developer',
      experience: '5 years',
      status: 'interview',
      appliedDate: '2024-01-20',
      resume: 'alice_johnson_resume.pdf'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1 (555) 987-6543',
      position: 'Product Manager',
      experience: '7 years',
      status: 'offer',
      appliedDate: '2024-01-18',
      resume: 'bob_smith_resume.pdf'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1 (555) 456-7890',
      position: 'UX Designer Intern',
      experience: '1 year',
      status: 'hired',
      appliedDate: '2024-01-15',
      resume: 'carol_davis_resume.pdf'
    }
  ];

  const getJobStatusColor = (status: JobPosting['status']) => {
    switch (status) {
      case 'active': return 'bg-accent/10 text-accent border-accent/20';
      case 'closed': return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'draft': return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  const getCandidateStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'applied': return 'bg-primary/10 text-primary border-primary/20';
      case 'screening': return 'bg-warning/10 text-warning border-warning/20';
      case 'interview': return 'bg-accent/10 text-accent border-accent/20';
      case 'offer': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'hired': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const getTypeIcon = (type: JobPosting['type']) => {
    switch (type) {
      case 'full-time': return <Briefcase className="h-4 w-4" />;
      case 'part-time': return <Clock className="h-4 w-4" />;
      case 'contract': return <Edit className="h-4 w-4" />;
      case 'intern': return <UserPlus className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recruitment Management</h1>
          <p className="text-muted-foreground">Manage job postings and candidate pipeline</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Users className="h-4 w-4" />
            Candidate Pool
          </Button>
          <Button variant="neu-primary" onClick={() => setShowJobForm(true)}>
            <Briefcase className="h-4 w-4" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
              <p className="text-2xl font-bold">{jobPostings.filter(job => job.status === 'active').length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
              <p className="text-2xl font-bold">{candidates.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Interviews</p>
              <p className="text-2xl font-bold">{candidates.filter(c => c.status === 'interview').length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Hired</p>
              <p className="text-2xl font-bold">{candidates.filter(c => c.status === 'hired').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'jobs' ? 'neu-primary' : 'ghost'}
          onClick={() => setActiveTab('jobs')}
        >
          Job Postings
        </Button>
        <Button 
          variant={activeTab === 'candidates' ? 'neu-primary' : 'ghost'}
          onClick={() => setActiveTab('candidates')}
        >
          Candidates
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="neu-surface p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neu-inset border-0 bg-muted/30"
            />
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobPostings.map((job) => (
            <Card key={job.id} className="neu-surface p-6 hover:scale-105 transition-all duration-200">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                  <Badge className={getJobStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getTypeIcon(job.type)}
                    <span className="capitalize">{job.type.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline">
                    {job.applicants} applicants
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="neu-surface p-6 hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary-gradient flex items-center justify-center">
                    <span className="text-primary-foreground font-medium">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">{candidate.email}</span>
                      <span className="text-sm text-muted-foreground">{candidate.experience} experience</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge className={getCandidateStatusColor(candidate.status)}>
                      {candidate.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Job Form Modal (simplified) */}
      {showJobForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="neu-surface p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Post New Job</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowJobForm(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Job Title</label>
                <Input className="mt-1 neu-inset border-0 bg-muted/30" placeholder="e.g. Senior Software Engineer" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Input className="mt-1 neu-inset border-0 bg-muted/30" placeholder="Engineering" />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input className="mt-1 neu-inset border-0 bg-muted/30" placeholder="Remote / San Francisco" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Job Description</label>
                <Textarea 
                  className="mt-1 neu-inset border-0 bg-muted/30 min-h-32" 
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowJobForm(false)}>
                  Cancel
                </Button>
                <Button variant="neu-primary">
                  Post Job
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RecruitmentManagement;