import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu, { useMenuContext } from '../base/Menu';
import Button from '../base/Button';
import Input from '../base/Input';
import Badge from '../base/Badge';
import { Avatar } from '../base/Avatar';

type CompanyProfile = {
  id: string;
  name: string;
  companyId: string;
};

const companyProfiles: CompanyProfile[] = [
  { id: 'bk', name: 'Big Kahuna Burger Ltd.', companyId: '593596832' },
  { id: 'rr-1', name: 'Rad Roofing', companyId: '482104567' },
  { id: 'acme', name: 'Acme Corporation', companyId: '718293401' },
  { id: 'stark', name: 'Stark Industries', companyId: '905817234' },
  { id: 'wayne', name: 'Wayne Enterprises', companyId: '336492018' },
  { id: 'globex', name: 'Globex Corporation', companyId: '651807392' },
  { id: 'initech', name: 'Initech', companyId: '274930618' },
  { id: 'umbrella', name: 'Umbrella Corp.', companyId: '890145726' },
  { id: 'cyberdyne', name: 'Cyberdyne Systems', companyId: '503628194' },
  { id: 'wonka', name: 'Wonka Industries', companyId: '417295083' },
];

const CompanyListItem = ({
  company,
  onSelect,
}: {
  company: CompanyProfile;
  onSelect: () => void;
}) => {
  const { setOpen } = useMenuContext();

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 p-4 text-left transition-colors duration-300 hover:bg-gray-50 cursor-pointer"
      onClick={() => {
        onSelect();
        setOpen(false);
      }}
    >
      <Avatar
        size="md"
        fullName={company.name}
        fallbackClassName="bg-smart-main"
      />
      <div className="min-w-0 flex flex-col">
        <div className="truncate text-sm font-medium leading-5 text-gray-900">
          {company.name}
        </div>
        <Badge size="xs" color="gray" className="self-start">
          ID : {company.companyId}
        </Badge>
      </div>
    </button>
  );
};

const CompanyProfileBlock = ({ company }: { company: CompanyProfile }) => {
  const { setOpen } = useMenuContext();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <Avatar
          size="lg"
          fullName={company.name}
          fallbackClassName="bg-smart-main"
        />
        <div className="min-w-0 flex flex-col gap-1">
          <div className="truncate text-base font-semibold leading-6 text-gray-900">
            {company.name}
          </div>
          <Badge size="xs" color="gray" className="self-start">
            ID : {company.companyId}
          </Badge>
        </div>
      </div>
      <Button
        variant="secondary"
        size="md"
        className="w-full"
        onClick={() => {
          navigate('/settings/business-details');
          setOpen(false);
        }}
      >
        Business Details
      </Button>
    </div>
  );
};

interface DropdownCompanyProps {
  initialCompanyName?: string;
}

export const DropdownCompany: React.FC<DropdownCompanyProps> = ({
  initialCompanyName = 'Big Kahuna Burger',
}) => {
  const defaultCompany =
    companyProfiles.find(
      (company) =>
        company.name === initialCompanyName ||
        company.name.startsWith(initialCompanyName)
    ) ?? companyProfiles[0];

  const [selectedCompanyId, setSelectedCompanyId] = useState(defaultCompany.id);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCompany =
    companyProfiles.find((company) => company.id === selectedCompanyId) ??
    defaultCompany;

  const switchableCompanies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return companyProfiles
      .filter((company) => company.id !== selectedCompanyId)
      .filter(
        (company) =>
          !query ||
          company.name.toLowerCase().includes(query) ||
          company.companyId.includes(query)
      );
  }, [searchQuery, selectedCompanyId]);

  return (
    <Menu.Root placement="bottom-end">
      <Menu.Trigger asChild>
        <Button variant="secondary" size="lg">
          {selectedCompany.name}
        </Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="z-50">
          <Menu.Popup className="w-full max-w-[368px] min-w-[368px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-dropdown">
            <div className="border-b border-gray-200 p-3">
              <CompanyProfileBlock company={selectedCompany} />
            </div>

            <div className="border-b border-gray-200 p-4">
              <Input
                placeholder="Search profile"
                type="text"
                size="sm"
                icon="search"
                value={searchQuery}
                clearable
                onClear={() => setSearchQuery('')}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <div className="max-h-[335px] overflow-y-auto no-scrollbar divide-y divide-gray-200">
              {switchableCompanies.map((company) => (
                <CompanyListItem
                  key={company.id}
                  company={company}
                  onSelect={() => setSelectedCompanyId(company.id)}
                />
              ))}
              {switchableCompanies.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No profiles found
                </div>
              )}
            </div>

            <div className="border-t border-gray-200">
              <div className="p-4">
                <Button
                  variant="linkPrimary"
                  size="sm"
                  icon="plus"
                  iconDirection="left"
                  className="w-full"
                >
                  Onboard for a Different Business
                </Button>
              </div>
              <div className="border-t border-gray-200 p-4">
                <Button variant="secondary" size="md" className="w-full">
                  Sign Out
                </Button>
              </div>
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};
