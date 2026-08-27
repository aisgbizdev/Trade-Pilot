// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'journal_entry_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$JournalEntryList extends JournalEntryList {
  @override
  final BuiltList<JournalEntry> entries;

  factory _$JournalEntryList(
          [void Function(JournalEntryListBuilder)? updates]) =>
      (JournalEntryListBuilder()..update(updates))._build();

  _$JournalEntryList._({required this.entries}) : super._();
  @override
  JournalEntryList rebuild(void Function(JournalEntryListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  JournalEntryListBuilder toBuilder() =>
      JournalEntryListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is JournalEntryList && entries == other.entries;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, entries.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'JournalEntryList')
          ..add('entries', entries))
        .toString();
  }
}

class JournalEntryListBuilder
    implements Builder<JournalEntryList, JournalEntryListBuilder> {
  _$JournalEntryList? _$v;

  ListBuilder<JournalEntry>? _entries;
  ListBuilder<JournalEntry> get entries =>
      _$this._entries ??= ListBuilder<JournalEntry>();
  set entries(ListBuilder<JournalEntry>? entries) => _$this._entries = entries;

  JournalEntryListBuilder() {
    JournalEntryList._defaults(this);
  }

  JournalEntryListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _entries = $v.entries.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(JournalEntryList other) {
    _$v = other as _$JournalEntryList;
  }

  @override
  void update(void Function(JournalEntryListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  JournalEntryList build() => _build();

  _$JournalEntryList _build() {
    _$JournalEntryList _$result;
    try {
      _$result = _$v ??
          _$JournalEntryList._(
            entries: entries.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'entries';
        entries.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'JournalEntryList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
