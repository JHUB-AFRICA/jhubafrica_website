interface AdminImageUploadProps {
  onFileSelected: (file: File | null) => void;
  previewUrl?: string;
}

export function AdminImageUpload({
  onFileSelected,
  previewUrl,
}: AdminImageUploadProps) {
  return (
    <>
      <label
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
          style={{ cursor: "pointer" }}
        />
        <span style={{ fontSize: "0.9rem" }}>Upload image (optional)</span>
      </label>
      {previewUrl && (
        <div style={{ gridColumn: "1 / -1" }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </>
  );
}
