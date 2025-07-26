import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye,
  Trash2,
  Search,
  Filter,
  FolderOpen,
  File,
  Lock,
  Share2,
  Calendar,
  User
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'policy' | 'form' | 'certificate' | 'report' | 'other';
  category: 'HR' | 'Finance' | 'Legal' | 'Operations' | 'IT';
  size: string;
  uploadDate: string;
  uploadedBy: string;
  status: 'active' | 'archived' | 'expired';
  access: 'public' | 'restricted' | 'confidential';
}

const DocumentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const documents: Document[] = [
    {
      id: '1',
      name: 'Employee Handbook 2024.pdf',
      type: 'policy',
      category: 'HR',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      uploadedBy: 'John Admin',
      status: 'active',
      access: 'public'
    },
    {
      id: '2',
      name: 'Software License Agreement.pdf',
      type: 'contract',
      category: 'Legal',
      size: '847 KB',
      uploadDate: '2024-01-10',
      uploadedBy: 'Sarah Legal',
      status: 'active',
      access: 'restricted'
    },
    {
      id: '3',
      name: 'Q4 Financial Report.xlsx',
      type: 'report',
      category: 'Finance',
      size: '1.2 MB',
      uploadDate: '2024-01-05',
      uploadedBy: 'Mike Finance',
      status: 'active',
      access: 'confidential'
    },
    {
      id: '4',
      name: 'Leave Application Form.docx',
      type: 'form',
      category: 'HR',
      size: '124 KB',
      uploadDate: '2024-01-01',
      uploadedBy: 'HR Team',
      status: 'active',
      access: 'public'
    }
  ];

  const categories = ['HR', 'Finance', 'Legal', 'Operations', 'IT'];
  const documentTypes = ['contract', 'policy', 'form', 'certificate', 'report', 'other'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return <FileText className="h-5 w-5 text-primary" />;
      case 'policy': return <Lock className="h-5 w-5 text-accent" />;
      case 'form': return <File className="h-5 w-5 text-warning" />;
      case 'certificate': return <Badge className="h-5 w-5 text-destructive" />;
      case 'report': return <FileText className="h-5 w-5 text-muted-foreground" />;
      default: return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getAccessColor = (access: Document['access']) => {
    switch (access) {
      case 'public': return 'bg-accent/10 text-accent border-accent/20';
      case 'restricted': return 'bg-warning/10 text-warning border-warning/20';
      case 'confidential': return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'active': return 'bg-accent/10 text-accent border-accent/20';
      case 'archived': return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'expired': return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Organize and manage company documents</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <FolderOpen className="h-4 w-4" />
            New Folder
          </Button>
          <Button variant="neu-primary">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold">{documents.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <Share2 className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Shared</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Confidential</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="neu-surface p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neu-inset border-0 bg-muted/30"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-xl neu-inset border-0 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-xl neu-inset border-0 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Types</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="neu-surface p-6 hover:scale-105 transition-all duration-200 group">
            <div className="space-y-4">
              {/* Document Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(document.type)}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {document.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{document.size}</p>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon-sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Document Metadata */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{document.category}</Badge>
                  <Badge className={getAccessColor(document.access)}>
                    {document.access}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{document.uploadedBy}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status */}
              <Badge className={getStatusColor(document.status)}>
                {document.status}
              </Badge>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Area */}
      <Card className="neu-surface p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Upload New Document</h3>
            <p className="text-muted-foreground">Drag and drop files here or click to browse</p>
          </div>
          <Button variant="neu-primary">
            Choose Files
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DocumentManagement;