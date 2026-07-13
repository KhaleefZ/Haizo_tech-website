import { InquiriesTable } from '@/components/inquiries/InquiriesTable';

export default function InquiriesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
        <p className="text-muted-foreground">Manage and track contact form submissions from the public website.</p>
      </div>
      
      <InquiriesTable />
    </div>
  );
}
