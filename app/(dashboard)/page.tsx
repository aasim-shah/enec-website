"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useApi from "@/hooks/useApi";
import { fetchStats } from "@/lib/services";
import { Activity, Users, FileText, Languages, Video } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data, error, loading, execute } = useApi(fetchStats);
  const [stats, setStats] = useState({
    videos: 0,
    languages: 0,
  });

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (data) {
      setStats(data.data);
    }
  }, [data]);

  console.log({ stats });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.videos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <Languages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.languages}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
