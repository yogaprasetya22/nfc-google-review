export interface PlaceSelection {
  place_id: string;
  name: string;
  address: string;
  source: "place_id" | "url" | "search";
  direct_url?: string;
}

export interface GooglePlaceSuggestion {
  place_id: string;
  name: string;
  formatted_address: string;
}

export interface TagActivationWizardProps {
  initialBusinessName?: string;
  onSelectPlace: (place: PlaceSelection) => void;
  onBusinessNameChange?: (name: string) => void;
}

export interface GoogleReviewUrlInputProps {
  value: string;
  onChange: (resolvedUrl: string, detectedBusinessName?: string) => void;
  label?: string;
  placeholder?: string;
  autoExtractBusinessName?: boolean;
  className?: string;
  onSearchQueryChange?: (query: string) => void;
  onPlaceSelected?: (suggestion: GooglePlaceSuggestion) => void;
  onUrlInputted?: (url: string, extractedName?: string) => void;
}
