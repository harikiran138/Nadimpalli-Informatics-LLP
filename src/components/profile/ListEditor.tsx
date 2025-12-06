import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FieldConfig {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'date' | 'select' | 'file';
    placeholder?: string;
    options?: string[]; // for select
    required?: boolean;
}

interface ListEditorProps {
    items: any[];
    onUpdate: (items: any[]) => void;
    fields: FieldConfig[];
    title: string;
    description?: string;
    emptyText?: string;
    isEditing: boolean;
    renderItem: (item: any) => React.ReactNode;
}

export function ListEditor({ items = [], onUpdate, fields, title, description, emptyText, isEditing, renderItem }: ListEditorProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState<any>({});

    const handleAdd = () => {
        // Validate required fields
        const missing = fields.filter(f => f.required && !newItem[f.name]);
        if (missing.length > 0) {
            alert(`Please fill required fields: ${missing.map(f => f.label).join(', ')}`);
            return;
        }
        onUpdate([...items, newItem]);
        setNewItem({});
        setIsAdding(false);
    };

    const handleDelete = (index: number) => {
        if (!confirm("Remove this item?")) return;
        const updated = items.filter((_, i) => i !== index);
        onUpdate(updated);
    };

    return (
        <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    {description && <p className="text-sm text-slate-500">{description}</p>}
                </div>
                {isEditing && !isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Add {title.slice(0, -1)} {/* Crude singularize */}
                    </Button>
                )}
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="bg-white/60 border border-blue-200 rounded-2xl p-6 relative">
                            <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">New Entry Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {fields.map(field => (
                                    <div key={field.name} className={field.type === 'textarea' ? "md:col-span-2" : ""}>
                                        <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">{field.label} {field.required && "*"}</label>
                                        {field.type === 'textarea' ? (
                                            <Textarea
                                                placeholder={field.placeholder}
                                                value={newItem[field.name] || ''}
                                                onChange={e => setNewItem({ ...newItem, [field.name]: e.target.value })}
                                                className="bg-white/80 border-white/60 min-h-[100px]"
                                            />
                                        ) : field.type === 'select' ? (
                                            <div className="relative">
                                                <select
                                                    value={newItem[field.name] || ''}
                                                    onChange={e => setNewItem({ ...newItem, [field.name]: e.target.value })}
                                                    className="w-full h-10 px-3 rounded-md bg-white/80 border border-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                >
                                                    <option value="">Select {field.label}</option>
                                                    {field.options?.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : field.type === 'file' ? (
                                            <Input
                                                type="text"
                                                placeholder="Paste URL (File upload pending)"
                                                value={newItem[field.name] || ''}
                                                onChange={e => setNewItem({ ...newItem, [field.name]: e.target.value })}
                                                className="bg-white/80 border-white/60 h-10"
                                            />
                                        ) : (
                                            <Input
                                                type={field.type || 'text'}
                                                placeholder={field.placeholder}
                                                value={newItem[field.name] || ''}
                                                onChange={e => setNewItem({ ...newItem, [field.name]: e.target.value })}
                                                className="bg-white/80 border-white/60 h-10"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-red-500">Cancel</Button>
                                <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-500 text-white"><Check className="w-4 h-4 mr-2" /> Add Entry</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="space-y-4">
                {items.length === 0 && !isAdding && (
                    <div className="text-center py-8 bg-white/20 rounded-xl border border-white/30 border-dashed">
                        <p className="text-slate-400 italic font-medium">{emptyText || "No entries yet."}</p>
                    </div>
                )}
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/60 border border-white/60 rounded-2xl p-6 relative group hover:shadow-md transition-all"
                    >
                        {isEditing && (
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(index)}
                                className="absolute top-4 right-4 text-red-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                        {renderItem(item)}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
