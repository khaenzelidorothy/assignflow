'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useOrganization } from '@/hooks/useOrganization';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { FairnessChart } from '@/components/dashboard/FairnessChart';
import { BurnoutAlerts } from '@/components/dashboard/BurnoutAlerts';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ScheduleStatus } from '@/components/dashboard/ScheduleStatus';

export default function DashboardPage() {
  const { organization } = useOrganization();
  const { metrics, isLoading } = useAnalytics(organization?.id);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {organization?.name} - {organization?.subscription_plan} Plan
        </p>
      </div>
      
      <MetricsGrid metrics={metrics} isLoading={isLoading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fairness Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <FairnessChart data={metrics?.fairnessDistribution} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Burnout Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <BurnoutAlerts members={metrics?.burnoutRiskMembers} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleStatus schedules={metrics?.upcomingSchedules} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={metrics?.recentActivities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}