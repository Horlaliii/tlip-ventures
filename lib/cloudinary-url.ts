// Shared by the image loader (client) and share images (server).

// A URL path segment made only of Cloudinary transformation parameters, e.g. "f_auto,q_auto,w_400".
export const TRANSFORM_SEGMENT = /^(?:(?:a|ar|b|bo|c|co|dpr|e|f|fl|g|h|l|o|q|r|t|u|w|x|y|z)_[^,/]+)(?:,(?:a|ar|b|bo|c|co|dpr|e|f|fl|g|h|l|o|q|r|t|u|w|x|y|z)_[^,/]+)*$/;
