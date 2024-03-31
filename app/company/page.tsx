import { createClient } from '@/utils/supabase/server';
import CompanyPage from './CompanyPage';

export default async function Company() {
    const supabase = createClient();
    const { data: documents } = await supabase
        .from('documents')
        .select()
        .order('created_at', { ascending: true });

    return <CompanyPage documents={documents ?? []} />;
}