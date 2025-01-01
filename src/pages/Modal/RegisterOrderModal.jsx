import useRegisterOrderWindow from "@/app/helper/windows-hooks/use-register-order-window";

/**
 * 주문등록 모달
 */
const RegisterOrderModal = () => {
  const { member } = useRegisterOrderWindow();

  return (
    <div>
      주문등록 모달 : <br />
      {!!member && <div>{JSON.stringify(member)}</div>}
    </div>
  );
};

export default RegisterOrderModal;
