interface Props {
  data: any;
}

export default function ActionRenderer(
  props: Props
) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
      }}
    >
      <button
        onClick={() =>
          alert(
            `View ${props.data.userName}`
          )
        }
      >
        View
      </button>

      <button
        onClick={() =>
          alert(
            `Edit ${props.data.userName}`
          )
        }
      >
        Edit
      </button>
    </div>
  );
}