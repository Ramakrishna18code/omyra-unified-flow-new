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
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle actions with loading states
  const handleAction = (action: string, docId?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  };

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
      case 'certificate': return <FileText className="h-5 w-5 text-destructive" />;
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
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-accent text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-down">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Document action completed successfully!
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-card p-8 rounded-2xl shadow-2xl animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Processing document...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Document Management
          </h1>
          <p className="text-muted-foreground">Organize and manage company documents</p>
        </div>
        
        <div className="flex gap-3 animate-fade-in-right">
          <Button 
            variant="outline" 
            className="hover-lift group"
            onClick={() => handleAction('new-folder')}
            disabled={isLoading}
          >
            <FolderOpen className="h-4 w-4 group-hover:animate-bounce-in" />
            New Folder
          </Button>
          <Button 
            variant="neu-primary" 
            className="hover-glow group"
            onClick={() => handleAction('upload')}
            disabled={isLoading}
          >
            <Upload className="h-4 w-4 group-hover:animate-bounce-in" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'total')}
        >
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Total Documents</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{documents.length}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'active')}
        >
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-accent group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">Active</p>
              <p className="text-2xl font-bold text-accent group-hover:scale-105 transition-transform">
                {documents.filter(d => d.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'categories')}
        >
          <div className="flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-warning group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-warning transition-colors">Categories</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{categories.length}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'size')}
        >
          <div className="flex items-center gap-3">
            <Download className="h-8 w-8 text-primary group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Total Size</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">12.4 MB</p>
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
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neu-inset focus:shadow-lg transition-all duration-300"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg neu-inset hover-lift transition-all duration-300 bg-background border-0"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-lg neu-inset hover-lift transition-all duration-300 bg-background border-0"
            >
              <option value="all">All Types</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
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

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up" style={{animationDelay: '400ms'}}>
        {filteredDocuments.map((document, index) => (
          <Card 
            key={document.id} 
            className="neu-surface p-6 hover-lift group cursor-pointer stagger-item"
            style={{animationDelay: `${500 + index * 100}ms`}}
            onClick={() => handleAction('view', document.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getTypeIcon(document.type)}
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate max-w-[200px]">
                    {document.name}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize">{document.type}</p>
                </div>
              </div>
              <Badge className={getAccessColor(document.access)} variant="outline">
                {document.access}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="outline">{document.category}</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{document.size}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{document.uploadedBy}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(document.status)}>
                  {document.status}
                </Badge>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover-scale group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('view', document.id);
                    }}
                    disabled={isLoading}
                  >
                    <Eye className="h-4 w-4 group-hover:animate-bounce-in" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover-scale group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('download', document.id);
                    }}
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4 group-hover:animate-bounce-in" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover-scale group text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('delete', document.id);
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 group-hover:animate-bounce-in" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{animationDelay: '500ms'}}>
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('bulk-upload')}
        >
          <div className="flex items-center gap-4">
            <Upload className="h-12 w-12 text-primary group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">Bulk Upload</h3>
              <p className="text-sm text-muted-foreground">Upload multiple documents at once</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('shared-documents')}
        >
          <div className="flex items-center gap-4">
            <Share2 className="h-12 w-12 text-accent group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-accent transition-colors">Shared Documents</h3>
              <p className="text-sm text-muted-foreground">Manage document sharing and permissions</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('archive-management')}
        >
          <div className="flex items-center gap-4">
            <FolderOpen className="h-12 w-12 text-warning group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-warning transition-colors">Archive Management</h3>
              <p className="text-sm text-muted-foreground">Manage archived documents</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocumentManagement;
