import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Envelope, Shield, ArrowSquareOut, SignOut } from 'phosphor-react';

export default function DashboardSettings() {
  const { user, signOut } = useAuth();

  const userImage = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0];
  const userEmail = user?.email;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile section */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <User weight="duotone" className="h-5 w-5" />
          Profile
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {userImage ? (
              <img
                src={userImage}
                alt={userName || 'Profile'}
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <User weight="bold" className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <div className="font-medium">{userName || 'User'}</div>
              <div className="text-sm text-muted-foreground">
                {userEmail}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <SignOut weight="bold" className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Email preferences */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Envelope weight="duotone" className="h-5 w-5" />
          Email Preferences
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Email notifications are managed through your Google account settings.
        </p>
        <Button variant="outline" disabled>
          Coming Soon
        </Button>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Shield weight="duotone" className="h-5 w-5" />
          Privacy & Security
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your data is stored securely and never shared with third parties. You can delete your
            account and all associated data at any time.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
                <ArrowSquareOut weight="bold" className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
                <ArrowSquareOut weight="bold" className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="p-6 border-destructive/50">
        <h2 className="font-semibold mb-4 text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting your account will permanently remove all your saved calculations and data. This
          action cannot be undone.
        </p>
        <Button variant="destructive" disabled>
          Delete Account (Coming Soon)
        </Button>
      </Card>
    </div>
  );
}
