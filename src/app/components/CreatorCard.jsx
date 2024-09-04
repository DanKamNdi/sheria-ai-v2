// components/CreatorCard.js

const CreatorCard = () => {
  return (
    <div className="max-w-md md:mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-2 mx-3">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Welcome to Sheria AI
          </div>
          <p className="block mt-1 text-lg leading-tight font-medium text-black">A message from our creator</p>
          <p className="mt-2 text-gray-500">
            At Augmentin AI we are building products that augment and enhance the capabilities of humans.
            We don't believe that AI is here to take people's jobs. We believe that AI is here to improve our jobs.
            We believe that AI is here to make us work faster and achieve more.
            The future we are building is one where it will take you hours or minutes to do something that would have
            otherwise taken you days.
            Our premiere product is Sheria AI. Sheria is built to help lawyers with legal research.
            <span className="block font-semibold mt-4">- Creator of Sheria AI, Alvin</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;