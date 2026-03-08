export default function ProductCardSkeleton() {
    return (
        <div className="w-full rounded-xl border bg-white shadow-sm p-4 space-y-3 animate-pulse">

            {/* Image skeleton */}
            <div className="w-full h-[300px] bg-gray-200 rounded-md"></div>

            {/* Buttons skeleton */}
            <div className="w-full flex justify-center gap-5 mt-5">
                <div className="h-10 w-20 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-20 bg-gray-200 rounded-md"></div>
            </div>

            {/* Title + Status */}
            <div className="flex justify-between items-start">
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            </div>

            {/* Category */}
            <div className="h-4 w-32 bg-gray-200 rounded"></div>

            {/* Price */}
            <div className="flex items-center gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-14 bg-gray-200 rounded"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
            </div>

            {/* Dimensions */}
            <div className="h-4 w-40 bg-gray-200 rounded"></div>

            {/* Tags */}
            <div className="flex gap-2">
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
            </div>

            {/* Review */}
            <div className="border-t pt-2 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>

        </div>
    );
}