import React from "react";
import Link from "next/link";
import {
  FolderGit2,
  Layers,
  Palette,
  MessageSquare,
  ArrowRight,
  Plus,
  Settings,
  FileText,
  Mail,
} from "lucide-react";
import { AdminNotice } from "@/components/admin/ui/AdminNotice";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Button } from "@/components/ui/Button";
import { initialRecentActivity } from "@/data/adminMockData";
import { getAllProjectsAdmin } from "@/lib/data/projects";
import { getAllApplicationsAdmin } from "@/lib/data/applications";
import { getAllDesignsAdmin } from "@/lib/data/designs";
import { getAllMessagesAdmin } from "@/lib/data/messages";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isConfigured = isSupabaseConfigured();
  const [projects, apps, designs, messages] = await Promise.all([
    getAllProjectsAdmin(),
    getAllApplicationsAdmin(),
    getAllDesignsAdmin(),
    getAllMessagesAdmin(),
  ]);

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.published).length;
  const draftProjects = projects.filter((p) => !p.published).length;

  const totalApps = apps.length;
  const publishedApps = apps.filter((a) => a.published).length;
  const draftApps = apps.filter((a) => !a.published).length;

  const totalDesigns = designs.length;
  const publishedDesigns = designs.filter((d) => d.published).length;
  const draftDesigns = designs.filter((d) => !d.published).length;

  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.isRead && m.status !== "archived").length;

  return (
    <div className={styles.dashboard}>
      {/* Notice Banner (only in fallback unconfigured mode) */}
      {!isConfigured && <AdminNotice />}

      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageSubtitle}>
            Welcome back, Asther. Centralized control panel for your public portfolio.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button href="/admin/projects/new" variant="primary" size="sm">
            <Plus size={15} />
            <span>New Project</span>
          </Button>
          <Button href="/admin/apps/new" variant="outline" size="sm">
            <Plus size={15} />
            <span>New App</span>
          </Button>
          <Button href="/admin/designs/new" variant="outline" size="sm">
            <Plus size={15} />
            <span>New Design</span>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid} aria-label="Portfolio content overview">
        {/* Card 1: Total Projects */}
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Total Projects</span>
            <div className={styles.metricIconWrap} aria-hidden="true">
              <FolderGit2 size={16} />
            </div>
          </div>
          <p className={styles.metricValue}>{totalProjects}</p>
          <div className={styles.metricFooter}>
            <span>{publishedProjects} published live</span>
            <span>·</span>
            <span>{draftProjects} draft</span>
          </div>
        </div>

        {/* Card 2: Total Apps */}
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Applications</span>
            <div className={styles.metricIconWrap} aria-hidden="true">
              <Layers size={16} />
            </div>
          </div>
          <p className={styles.metricValue}>{totalApps}</p>
          <div className={styles.metricFooter}>
            <span>{publishedApps} published live</span>
            <span>·</span>
            <span>{draftApps} draft</span>
          </div>
        </div>

        {/* Card 3: Total Designs */}
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Designs Portfolio</span>
            <div className={styles.metricIconWrap} aria-hidden="true">
              <Palette size={16} />
            </div>
          </div>
          <p className={styles.metricValue}>{totalDesigns}</p>
          <div className={styles.metricFooter}>
            <span>{publishedDesigns} published live</span>
            <span>·</span>
            <span>{draftDesigns} draft</span>
          </div>
        </div>

        {/* Card 4: Contact Messages */}
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Messages Inbox</span>
            <div className={styles.metricIconWrap} aria-hidden="true">
              <MessageSquare size={16} />
            </div>
          </div>
          <p className={styles.metricValue}>{totalMessages}</p>
          <div className={styles.metricFooter}>
            <span style={{ color: unreadMessages > 0 ? "#FF862D" : "inherit", fontWeight: unreadMessages > 0 ? 600 : "normal" }}>
              {unreadMessages} unread message{unreadMessages !== 1 ? "s" : ""}
            </span>
            <span>·</span>
            <Link href="/admin/messages" style={{ color: "inherit", textDecoration: "underline" }}>
              Open Inbox
            </Link>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Activity & Quick Actions */}
      <div className={styles.columnsGrid}>
        {/* Column 1: Recent Activity */}
        <AdminCard
          title="Recent Activity"
          subtitle="System audit feed from Supabase"
        >
          <ol className={styles.activityList}>
            {initialRecentActivity.map((act) => (
              <li key={act.id} className={styles.activityItem}>
                <div className={styles.activityIndicator} aria-hidden="true" />
                <div className={styles.activityContent}>
                  <div className={styles.activityActionRow}>
                    <span className={styles.activityAction}>{act.action}</span>
                    <span className={styles.activityTime}>{act.timestamp}</span>
                  </div>
                  <p className={styles.activityTitle}>{act.title}</p>
                  <span className={styles.activityUser}>by {act.user}</span>
                </div>
              </li>
            ))}
          </ol>
        </AdminCard>

        {/* Column 2: Quick Actions */}
        <AdminCard
          title="Quick Actions"
          subtitle="Direct shortcuts to core portfolio editors"
        >
          <div className={styles.quickActionList}>
            <Link href="/admin/designs/new" className={styles.quickActionCard}>
              <div className={styles.quickActionLeft}>
                <Plus size={18} className={styles.quickActionIcon} />
                <div className={styles.quickActionText}>
                  <span className={styles.quickActionLabel}>Create Design</span>
                  <span className={styles.quickActionDesc}>Add a visual system or UI design</span>
                </div>
              </div>
              <ArrowRight size={16} className={styles.arrowIcon} />
            </Link>

            <Link href="/admin/projects/new" className={styles.quickActionCard}>
              <div className={styles.quickActionLeft}>
                <Plus size={18} className={styles.quickActionIcon} />
                <div className={styles.quickActionText}>
                  <span className={styles.quickActionLabel}>Create Project</span>
                  <span className={styles.quickActionDesc}>Add a new engineering case study</span>
                </div>
              </div>
              <ArrowRight size={16} className={styles.arrowIcon} />
            </Link>

            <Link href="/admin/apps/new" className={styles.quickActionCard}>
              <div className={styles.quickActionLeft}>
                <Plus size={18} className={styles.quickActionIcon} />
                <div className={styles.quickActionText}>
                  <span className={styles.quickActionLabel}>Create Application</span>
                  <span className={styles.quickActionDesc}>Add a demo or production application</span>
                </div>
              </div>
              <ArrowRight size={16} className={styles.arrowIcon} />
            </Link>

            <Link href="/admin/messages" className={styles.quickActionCard}>
              <div className={styles.quickActionLeft}>
                <Mail size={18} className={styles.quickActionIcon} />
                <div className={styles.quickActionText}>
                  <span className={styles.quickActionLabel}>
                    View Messages {unreadMessages > 0 && `(${unreadMessages} new)`}
                  </span>
                  <span className={styles.quickActionDesc}>Review inquiries and draft email replies</span>
                </div>
              </div>
              <ArrowRight size={16} className={styles.arrowIcon} />
            </Link>

            <Link href="/admin/content" className={styles.quickActionCard}>
              <div className={styles.quickActionLeft}>
                <FileText size={18} className={styles.quickActionIcon} />
                <div className={styles.quickActionText}>
                  <span className={styles.quickActionLabel}>Edit Bio & Resume</span>
                  <span className={styles.quickActionDesc}>Manage skills, education & journey</span>
                </div>
              </div>
              <ArrowRight size={16} className={styles.arrowIcon} />
            </Link>

            <Link href="/admin/settings" className={styles.quickActionCard}>
              <div className={styles.quickActionLeft}>
                <Settings size={18} className={styles.quickActionIcon} />
                <div className={styles.quickActionText}>
                  <span className={styles.quickActionLabel}>Site Settings</span>
                  <span className={styles.quickActionDesc}>SEO metadata & social channels</span>
                </div>
              </div>
              <ArrowRight size={16} className={styles.arrowIcon} />
            </Link>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
