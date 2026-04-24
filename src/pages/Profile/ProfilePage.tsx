import { useEffect, useRef, useState } from 'react';
import Box from '../../components/layout/Box';
import Input from '../../components/common/base/Input';
import Button from '../../components/common/base/Button';
import Badge from '../../components/common/base/Badge';
import Icon from '../../components/common/base/Icon';
import RowsPerPageSelect from '../../components/common/base/RowsPerPageSelect';
import { Avatar } from '../../components/common/base/Avatar';

const ProfilePage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [email, setEmail] = useState('jane.cooper@bigkahunaburger.com');
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Cooper');
  const [phoneNumber, setPhoneNumber] = useState('+1 56 978 483');
  const [avatarImageSrc, setAvatarImageSrc] = useState<string | undefined>();
  const [activeField, setActiveField] = useState<
    'email' | 'firstName' | 'lastName' | 'phoneNumber' | null
  >(null);
  const [emailDraft, setEmailDraft] = useState(
    'jane.cooper@bigkahunaburger.com'
  );
  const [firstNameDraft, setFirstNameDraft] = useState('Jane');
  const [lastNameDraft, setLastNameDraft] = useState('Cooper');
  const [phoneNumberDraft, setPhoneNumberDraft] = useState('+1 56 978 483');
  const [avatarObjectUrl, setAvatarObjectUrl] = useState<string | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl);
      }
    };
  }, [avatarObjectUrl]);

  const handleEditProfile = () => {
    setEmailDraft(email);
    setFirstNameDraft(firstName);
    setLastNameDraft(lastName);
    setPhoneNumberDraft(phoneNumber);
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setEmailDraft(email);
    setFirstNameDraft(firstName);
    setLastNameDraft(lastName);
    setPhoneNumberDraft(phoneNumber);
    setActiveField(null);
  };

  const handleSaveEdit = () => {
    if (activeField === 'email') {
      setEmail(emailDraft.trim() || email);
    }
    if (activeField === 'firstName') {
      setFirstName(firstNameDraft.trim() || firstName);
    }
    if (activeField === 'lastName') {
      setLastName(lastNameDraft.trim() || lastName);
    }
    if (activeField === 'phoneNumber') {
      setPhoneNumber(phoneNumberDraft.trim() || phoneNumber);
    }
    setActiveField(null);
  };

  const handleStartFieldEdit = (
    field: 'email' | 'firstName' | 'lastName' | 'phoneNumber'
  ) => {
    setActiveField(field);
  };

  const handleAvatarSelectClick = () => {
    avatarFileInputRef.current?.click();
  };

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      event.target.value = '';
      return;
    }

    const nextObjectUrl = URL.createObjectURL(selectedFile);
    if (avatarObjectUrl) {
      URL.revokeObjectURL(avatarObjectUrl);
    }

    setAvatarObjectUrl(nextObjectUrl);
    setAvatarImageSrc(nextObjectUrl);
    event.target.value = '';
  };

  const handleAvatarRemove = () => {
    if (avatarObjectUrl) {
      URL.revokeObjectURL(avatarObjectUrl);
    }
    setAvatarObjectUrl(null);
    setAvatarImageSrc(undefined);
  };

  if (isEditingProfile) {
    return (
      <div className="max-w-9xl mx-auto">
        <Box className="max-w-9xl mx-auto">
          <div className="p-6">
            <div className="rounded-xl border border-gray-200 p-6 bg-white">
              <div className="flex items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar
                      size="xxl"
                      fullName={`${firstName} ${lastName}`}
                      imageSrc={avatarImageSrc}
                    />
                    <input
                      ref={avatarFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                    />
                    <button
                      type="button"
                      className="absolute -top-0.5 -right-0.5 inline-flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded border border-gray-300 bg-white shadow-sm"
                      aria-label="Edit avatar"
                      onClick={handleAvatarSelectClick}
                    >
                      <Icon
                        icon="pencil"
                        className="h-4 w-4 text-gray-500"
                      />
                    </button>
                    <button
                      type="button"
                      className="absolute -bottom-0.5 -right-0.5 inline-flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded border border-gray-300 bg-white shadow-sm"
                      aria-label="Remove avatar"
                      onClick={handleAvatarRemove}
                    >
                      <Icon icon="trash" className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 leading-8">
                      {firstName} {lastName}
                    </div>
                    <div className="mt-2.5">
                      <Badge color="gray" size="sm" rounded>
                        View Only
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-stretch divide-x divide-gray-200">
                  <div className="pr-10">
                    <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Status
                    </div>
                    <div className="mt-0.5">
                      <Badge
                        color="green"
                        size="sm"
                        rounded
                        icon="check-circle"
                        iconDirection="left"
                      >
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="pl-10">
                    <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Created on
                    </div>
                    <div className="mt-0.5 text-base font-medium text-gray-700">
                      Jun 09, 2023
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12">
              <h2 className="text-lg font-medium text-gray-900">
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <div className="mt-5 border-t border-gray-200">
              <div className="grid grid-cols-[312px_minmax(0,1fr)_auto] items-center py-6 border-b border-gray-200 gap-6">
                <div className="text-left text-sm leading-5 font-medium text-gray-700">
                  Email
                </div>
                {activeField === 'email' ? (
                  <Input
                    value={emailDraft}
                    onChange={(event) => setEmailDraft(event.target.value)}
                    className="w-full max-w-[312px]"
                  />
                ) : (
                  <div className="text-left text-base text-gray-700">
                    {email}
                  </div>
                )}
                <div className="ml-6 flex min-w-[220px] items-center gap-4 justify-end">
                  {activeField === 'email' ? (
                    <>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="linkPrimary"
                      size="md"
                      onClick={() => handleStartFieldEdit('email')}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[312px_minmax(0,1fr)_auto] items-center py-6 border-b border-gray-200 gap-6">
                <div className="text-left text-sm leading-5 font-medium text-gray-700">
                  First Name
                </div>
                {activeField === 'firstName' ? (
                  <>
                    <Input
                      value={firstNameDraft}
                      onChange={(event) =>
                        setFirstNameDraft(event.target.value)
                      }
                      className="w-full max-w-[312px]"
                    />
                    <div className="ml-6 flex min-w-[220px] items-center gap-4 justify-end">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-left text-base text-gray-700">
                      {firstName}
                    </div>
                    <Button
                      variant="linkPrimary"
                      size="md"
                      onClick={() => handleStartFieldEdit('firstName')}
                    >
                      Update
                    </Button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-[312px_1fr_auto] items-center py-6 border-b border-gray-200 gap-6">
                <div className="text-left text-sm leading-5 font-medium text-gray-700">
                  Last Name
                </div>
                {activeField === 'lastName' ? (
                  <>
                    <Input
                      value={lastNameDraft}
                      onChange={(event) => setLastNameDraft(event.target.value)}
                      className="w-full max-w-[312px]"
                    />
                    <div className="ml-6 flex min-w-[220px] items-center gap-4 justify-end">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-left text-base text-gray-700">
                      {lastName}
                    </div>
                    <Button
                      variant="linkPrimary"
                      size="md"
                      onClick={() => handleStartFieldEdit('lastName')}
                    >
                      Update
                    </Button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-[312px_1fr_auto] items-center pt-6 gap-6">
                <div className="text-left text-sm leading-5 font-medium text-gray-700">
                  Phone Number
                </div>
                {activeField === 'phoneNumber' ? (
                  <>
                    <Input
                      value={phoneNumberDraft}
                      onChange={(event) =>
                        setPhoneNumberDraft(event.target.value)
                      }
                      className="w-full max-w-[312px]"
                    />
                    <div className="ml-6 flex min-w-[220px] items-center gap-4 justify-end">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-left text-base text-gray-700">
                      {phoneNumber}
                    </div>
                    <Button
                      variant="linkPrimary"
                      size="md"
                      onClick={() => handleStartFieldEdit('phoneNumber')}
                    >
                      Update
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Box>
      </div>
    );
  }

  return (
    <div className="max-w-9xl mx-auto">
      <Box
        className="max-w-9xl mx-auto"
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
              <span className="text-lg leading-6 text-gray-900 font-medium">
                Users
              </span>
              <div className="text-sm text-gray-500">1 User</div>
            </div>
            <div className="w-full flex items-center justify-end gap-3">
              <Input
                placeholder="Search"
                type="text"
                className="w-80"
                icon="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button
                size="lg"
                variant="primary"
                icon="users"
                iconDirection="left"
              >
                Add New User
              </Button>
            </div>
          </div>
        }
        footer={
          <div className="w-full flex items-center justify-end gap-3 text-sm text-gray-700">
            <RowsPerPageSelect
              value={rowsPerPage}
              onChange={setRowsPerPage}
              options={[10, 25, 50]}
            />
            <div>
              Showing <b className="font-semibold">1 - 10</b> of{' '}
              <b className="font-semibold">97</b> results
            </div>
            <div className="grid grid-flow-col gap-2">
              <Button
                variant="secondary"
                size="md"
                icon="chevron-double-left"
                disabled
                aria-label="Go to first page"
              />
              <Button
                variant="secondary"
                size="md"
                icon="chevron-left"
                disabled
                aria-label="Go to previous page"
              />
              <Button
                variant="secondary"
                size="md"
                icon="chevron-right"
                aria-label="Go to next page"
              />
              <Button
                variant="secondary"
                size="md"
                icon="chevron-double-right"
                aria-label="Go to last page"
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto w-full px-6">
          <table className="table-fixed w-full min-w-full">
            <colgroup>
              <col className="w-[calc((100%-102px-9rem)/2)]" />
              <col className="w-[calc((100%-102px-9rem)/2)]" />
              <col className="w-36" />
              <col className="w-[102px]" />
            </colgroup>
            <thead>
              <tr className="border-b border-dashed border-gray-200">
                <th className="py-4 text-left">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                  >
                    <span className="uppercase text-xs text-gray-500 font-medium">
                      Member
                    </span>
                    <Icon icon="selector" className="w-4 h-4 text-gray-400" />
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                  >
                    <span className="uppercase text-xs text-gray-500 font-medium">
                      Role
                    </span>
                    <Icon icon="selector" className="w-4 h-4 text-gray-400" />
                  </button>
                </th>
                <th className="w-36 max-w-36 p-4 text-left">
                  <span className="uppercase text-xs text-gray-500 font-medium">
                    Status
                  </span>
                </th>
                <th className="w-[102px] max-w-[102px] p-4" />
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 last:border-b-0">
                <td className="py-4 align-middle">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      size="md"
                      fullName={`${firstName} ${lastName}`}
                      imageSrc={avatarImageSrc}
                    />
                    <div>
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        {firstName} {lastName}{' '}
                        <span className="text-gray-500 text-xs leading-4 font-normal">
                          (You)
                        </span>
                      </div>
                      <div className="text-sm leading-5 text-gray-500">
                        jane.coopers@bigkahunaburger.com
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-900 leading-5 font-medium flex items-center gap-1">
                    Administrator{' '}
                    <span className="text-gray-500 text-xs leading-4 font-normal">
                      (Owner)
                    </span>
                  </div>
                </td>
                <td className="w-36 max-w-36 p-4 align-middle">
                  <div className="flex items-center justify-start">
                    <Badge
                      color="green"
                      size="sm"
                      rounded
                      icon="check-circle"
                      iconDirection="left"
                    >
                      Active
                    </Badge>
                  </div>
                </td>
                <td className="w-[102px] max-w-[102px] p-4 align-middle text-right">
                  <div className="inline-flex items-center border border-gray-300 rounded-md">
                    <Button
                      icon="pencil"
                      variant="linkSecondary"
                      size="sm"
                      iconClass="text-gray-500 w-4.5 h-4.5"
                      aria-label="Edit profile"
                      onClick={handleEditProfile}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;
