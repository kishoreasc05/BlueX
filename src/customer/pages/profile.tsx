import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, MapPin, Phone, Mail, Calendar, ShieldCheck, Globe } from "lucide-react";

export function CustomerProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query profile from DB
  const { data: profile, isLoading } = useQuery({
    queryKey: ["customerProfile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Local Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [preferredLang, setPreferredLang] = useState("de");

  const [homeAddress, setHomeAddress] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("Zurich");
  const [canton, setCanton] = useState("ZH");
  const [country, setCountry] = useState("Switzerland");

  const [isEditing, setIsEditing] = useState(false);

  // Sync profile data to local state
  useEffect(() => {
    if (profile) {
      const names = (profile.full_name || "").split(" ");
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "");
      setPhone(profile.phone || "");
      setDob(profile.date_of_birth || "");
      setGender(profile.gender || "");
      setPreferredLang(profile.preferred_lang || "de");
      setHomeAddress(profile.home_address || "");
      setApartmentNo(profile.apartment_no || "");
      setPostalCode(profile.postal_code || "");
      setCity(profile.city || "Zurich");
      setCanton(profile.canton || "ZH");
      setCountry(profile.country || "Switzerland");
    }
  }, [profile]);

  // Mutation to update profile
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone.trim() || null,
          date_of_birth: dob || null,
          gender: gender || null,
          preferred_lang: preferredLang,
          home_address: homeAddress.trim() || null,
          apartment_no: apartmentNo.trim() || null,
          postal_code: postalCode.trim() || null,
          city: city.trim() || "Zurich",
          canton: canton || "ZH",
          country: country || "Switzerland",
        })
        .eq("id", user!.id);

      if (error) throw error;

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (authError) throw authError;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to update profile.");
    },
  });

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case "de":
        return "Deutsch (German)";
      case "fr":
        return "Français (French)";
      case "it":
        return "Italiano (Italian)";
      case "en":
        return "English";
      default:
        return lang;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(/\s+/)
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 font-semibold animate-pulse">Loading profile...</p>
      </div>
    );
  }

  const memberSinceDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Recently Joined";

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="My Profile"
        description="Manage your personal details, language preferences, and Swiss service address."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 items-start">
        {/* Profile Sidebar Info Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6 flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded-full bg-blue-650 bg-blue-600 text-white flex items-center justify-center text-3xl font-black shadow-inner select-none relative">
            {getInitials(profile?.full_name)}
            <div
              className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm"
              title="Verified Account"
            >
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {profile?.full_name || "Guest Customer"}
            </h2>
            <div className="flex items-center justify-center gap-1.5 pt-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                ID: {profile?.customer_id || "BX-PENDING"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-0.5">
                Verified
              </span>
            </div>
          </div>

          <div className="w-full border-t border-slate-100 pt-5 space-y-3.5 text-left text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Member Since</span>
              <span className="text-slate-800">{memberSinceDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Preferred Language</span>
              <span className="text-slate-800 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                {getLanguageLabel(preferredLang)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Default Canton</span>
              <span className="text-slate-800">{canton}</span>
            </div>
          </div>

          <Button
            onClick={() => {
              if (isEditing) {
                updateProfileMutation.mutate();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={updateProfileMutation.isPending}
            className={`w-full h-10 rounded-xl font-bold cursor-pointer shadow-sm transition-all ${
              isEditing
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {isEditing
              ? updateProfileMutation.isPending
                ? "Saving..."
                : "Save Profile"
              : "Edit Profile"}
          </Button>
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="w-full h-10 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Edit Form Area */}
        <div className="space-y-6">
          {/* Card 1: Personal Information */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold border-b border-slate-100 pb-3">
              <User className="h-5 w-5 text-blue-600" />
              <h3>Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. John"
                  className="rounded-xl border-slate-200 text-xs h-10 bg-slate-50/20 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. Doe"
                  className="rounded-xl border-slate-200 text-xs h-10 bg-slate-50/20 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="rounded-xl border-slate-200 text-xs h-10 bg-slate-50 text-slate-500 font-semibold"
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  To modify your email contact support.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. +41 79 123 45 67"
                  className="rounded-xl border-slate-200 text-xs h-10 bg-slate-50/20 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Date of Birth (Optional)
                </Label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  disabled={!isEditing}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Gender (Optional)</Label>
                <Select value={gender} onValueChange={setGender} disabled={!isEditing}>
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs h-10 bg-white disabled:bg-slate-50 disabled:text-slate-500">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> Preferred Language
                </Label>
                <Select
                  value={preferredLang}
                  onValueChange={setPreferredLang}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs h-10 bg-white disabled:bg-slate-50 disabled:text-slate-500">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="de">Deutsch (German)</SelectItem>
                    <SelectItem value="fr">Français (French)</SelectItem>
                    <SelectItem value="it">Italiano (Italian)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Card 2: Address Information */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold border-b border-slate-100 pb-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3>Address Information (Switzerland)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs font-semibold text-slate-500">
                  Home Address (Street, Number)
                </Label>
                <Input
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. Bahnhofstrasse 45"
                  className="rounded-xl border-slate-200 text-xs h-10 bg-slate-50/20 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">
                  Apartment / Suite Number
                </Label>
                <Input
                  value={apartmentNo}
                  onChange={(e) => setApartmentNo(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. Appt 3B"
                  className="rounded-xl border-slate-200 text-xs h-10 bg-slate-50/20 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Postal Code</Label>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. 8001"
                  className="rounded-xl border-slate-200 text-xs h-10 bg-slate-50/20 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. Zürich"
                  className="rounded-xl border-slate-200 text-xs h-10 bg-slate-50/20 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Canton</Label>
                <Select value={canton} onValueChange={setCanton} disabled={!isEditing}>
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs h-10 bg-white disabled:bg-slate-50 disabled:text-slate-500">
                    <SelectValue placeholder="Select Canton" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-56">
                    <SelectItem value="ZH">Zürich (ZH)</SelectItem>
                    <SelectItem value="BE">Bern (BE)</SelectItem>
                    <SelectItem value="LU">Luzern (LU)</SelectItem>
                    <SelectItem value="UR">Uri (UR)</SelectItem>
                    <SelectItem value="SZ">Schwyz (SZ)</SelectItem>
                    <SelectItem value="OW">Obwalden (OW)</SelectItem>
                    <SelectItem value="NW">Nidwalden (NW)</SelectItem>
                    <SelectItem value="GL">Glarus (GL)</SelectItem>
                    <SelectItem value="ZG">Zug (ZG)</SelectItem>
                    <SelectItem value="FR">Fribourg (FR)</SelectItem>
                    <SelectItem value="SO">Solothurn (SO)</SelectItem>
                    <SelectItem value="BS">Basel-Stadt (BS)</SelectItem>
                    <SelectItem value="BL">Basel-Landschaft (BL)</SelectItem>
                    <SelectItem value="SH">Schaffhausen (SH)</SelectItem>
                    <SelectItem value="AR">Appenzell Ausserrhoden (AR)</SelectItem>
                    <SelectItem value="AI">Appenzell Innerrhoden (AI)</SelectItem>
                    <SelectItem value="SG">St. Gallen (SG)</SelectItem>
                    <SelectItem value="GR">Graubünden (GR)</SelectItem>
                    <SelectItem value="AG">Aargau (AG)</SelectItem>
                    <SelectItem value="TG">Thurgau (TG)</SelectItem>
                    <SelectItem value="TI">Ticino (TI)</SelectItem>
                    <SelectItem value="VD">Vaud (VD)</SelectItem>
                    <SelectItem value="VS">Valais (VS)</SelectItem>
                    <SelectItem value="NE">Neuchâtel (NE)</SelectItem>
                    <SelectItem value="GE">Genève (GE)</SelectItem>
                    <SelectItem value="JU">Jura (JU)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs font-semibold text-slate-500">Country</Label>
                <Input
                  value={country}
                  disabled
                  className="rounded-xl border-slate-200 text-xs h-10 bg-slate-50 text-slate-500 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
