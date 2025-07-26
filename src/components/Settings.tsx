import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell,
  Palette,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  Building2,
  Users,
  CreditCard
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [showAPIKey, setShowAPIKey] = useState(false);

  const settingsSections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General',
      icon: SettingsIcon,
      description: 'Basic company and system settings'
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      description: 'Authentication and access control'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Email and push notification preferences'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Theme and branding customization'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Globe,
      description: 'Third-party services and APIs'
    },
    {
      id: 'billing',
      title: 'Billing',
      icon: CreditCard,
      description: 'Subscription and payment settings'
    }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="neu-surface p-6">
        <h3 className="text-lg font-semibold mb-4">Company Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input 
                className="mt-1 neu-inset border-0 bg-muted/30" 
                defaultValue="Omyra Technologies"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Industry</label>
              <Input 
                className="mt-1 neu-inset border-0 bg-muted/30" 
                defaultValue="Technology"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Company Size</label>
              <select className="w-full mt-1 px-4 py-2 rounded-xl neu-inset border-0 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>201-500 employees</option>
                <option>51-200 employees</option>
                <option>11-50 employees</option>
                <option>1-10 employees</option>
                <option>500+ employees</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Time Zone</label>
              <select className="w-full mt-1 px-4 py-2 rounded-xl neu-inset border-0 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>Pacific Standard Time (PST)</option>
                <option>Eastern Standard Time (EST)</option>
                <option>Central Standard Time (CST)</option>
                <option>Mountain Standard Time (MST)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Company Address</label>
            <Input 
              className="mt-1 neu-inset border-0 bg-muted/30" 
              defaultValue="123 Tech Street, San Francisco, CA 94105"
            />
          </div>
        </div>
      </Card>

      <Card className="neu-surface p-6">
        <h3 className="text-lg font-semibold mb-4">System Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Date Format</p>
              <p className="text-sm text-muted-foreground">Choose how dates are displayed</p>
            </div>
            <select className="px-4 py-2 rounded-xl neu-inset border-0 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Currency</p>
              <p className="text-sm text-muted-foreground">Default currency for payroll and expenses</p>
            </div>
            <select className="px-4 py-2 rounded-xl neu-inset border-0 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>INR (₹)</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Language</p>
              <p className="text-sm text-muted-foreground">Interface language</p>
            </div>
            <select className="px-4 py-2 rounded-xl neu-inset border-0 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="neu-surface p-6">
        <h3 className="text-lg font-semibold mb-4">Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Single Sign-On (SSO)</p>
              <p className="text-sm text-muted-foreground">Enable Google Workspace integration</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password Policy</p>
              <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="neu-surface p-6">
        <h3 className="text-lg font-semibold mb-4">API Keys & Tokens</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">API Key</label>
            <div className="flex gap-2 mt-1">
              <Input 
                type={showAPIKey ? "text" : "password"}
                className="neu-inset border-0 bg-muted/30" 
                defaultValue="sk-1234567890abcdef"
                readOnly
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowAPIKey(!showAPIKey)}
              >
                {showAPIKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Webhook URL</label>
              <Input 
                className="mt-1 neu-inset border-0 bg-muted/30" 
                placeholder="https://your-app.com/webhook"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rate Limit</label>
              <select className="w-full mt-1 px-4 py-2 rounded-xl neu-inset border-0 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>1000 requests/hour</option>
                <option>500 requests/hour</option>
                <option>100 requests/hour</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card className="neu-surface p-6">
        <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Employee Onboarding</p>
              <p className="text-sm text-muted-foreground">Notify when new employees join</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Leave Requests</p>
              <p className="text-sm text-muted-foreground">Notify managers of leave requests</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payroll Processing</p>
              <p className="text-sm text-muted-foreground">Notify when payroll is processed</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System Maintenance</p>
              <p className="text-sm text-muted-foreground">Notify about scheduled maintenance</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="neu-surface p-6">
        <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mobile App Notifications</p>
              <p className="text-sm text-muted-foreground">Push notifications to mobile devices</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Browser Notifications</p>
              <p className="text-sm text-muted-foreground">Show notifications in browser</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <Card className="neu-surface p-6">
        <h3 className="text-lg font-semibold mb-4">Brand Customization</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Company Logo</label>
            <div className="mt-2 p-4 border-2 border-dashed border-border rounded-xl text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Upload company logo</p>
              <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex gap-2 mt-1">
                <Input 
                  className="neu-inset border-0 bg-muted/30" 
                  defaultValue="#3B82F6"
                />
                <div className="w-10 h-10 rounded-lg bg-primary border border-border"></div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Secondary Color</label>
              <div className="flex gap-2 mt-1">
                <Input 
                  className="neu-inset border-0 bg-muted/30" 
                  defaultValue="#10B981"
                />
                <div className="w-10 h-10 rounded-lg bg-accent border border-border"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="neu-surface p-6">
        <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Use dark theme interface</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact Mode</p>
              <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'integrations': return (
        <Card className="neu-surface p-6">
          <h3 className="text-lg font-semibold mb-4">Third-party Integrations</h3>
          <p className="text-muted-foreground">Integration settings coming soon...</p>
        </Card>
      );
      case 'billing': return (
        <Card className="neu-surface p-6">
          <h3 className="text-lg font-semibold mb-4">Billing & Subscription</h3>
          <p className="text-muted-foreground">Billing settings coming soon...</p>
        </Card>
      );
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your system preferences and configurations</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            Reset to Defaults
          </Button>
          <Button variant="neu-primary">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="neu-surface p-4 lg:col-span-1">
          <nav className="space-y-2">
            {settingsSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'neu-primary' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon className="h-4 w-4" />
                <span>{section.title}</span>
              </Button>
            ))}
          </nav>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {settingsSections.find(s => s.id === activeSection)?.icon && 
                React.createElement(settingsSections.find(s => s.id === activeSection)!.icon, { 
                  className: "h-6 w-6 text-primary" 
                })
              }
              <h2 className="text-2xl font-bold">
                {settingsSections.find(s => s.id === activeSection)?.title}
              </h2>
            </div>
            <p className="text-muted-foreground">
              {settingsSections.find(s => s.id === activeSection)?.description}
            </p>
          </div>
          
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Settings;