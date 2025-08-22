import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !categories.some((cat) => cat.name === newCategory.trim())
    ) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCategory();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            ক্যাটাগরি ম্যানেজমেন্ট
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Add New Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              নতুন ক্যাটাগরি যোগ করুন
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ক্যাটাগরি নাম লিখুন..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button onClick={handleAddCategory} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Existing Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              বিদ্যমান ক্যাটাগরি সমূহ
            </label>
            <div className="max-h-60 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  কোন ক্যাটাগরি নেই
                </p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-800">{category.name}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            বন্ধ করুন
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
