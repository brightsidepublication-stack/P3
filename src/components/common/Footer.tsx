import { Container } from '../ui/Container';
import { APP_NAME, APP_VERSION } from '../../constants/app';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="py-6">
        <div className="flex flex-col gap-2 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-right">
          <span>{APP_NAME}</span>
          <span>نسخه {APP_VERSION}</span>
        </div>
      </Container>
    </footer>
  );
}