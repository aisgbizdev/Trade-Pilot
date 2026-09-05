// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_history.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionHistory extends ProgressionHistory {
  @override
  final BuiltList<ProgressionLedgerEntry> entries;

  factory _$ProgressionHistory(
          [void Function(ProgressionHistoryBuilder)? updates]) =>
      (ProgressionHistoryBuilder()..update(updates))._build();

  _$ProgressionHistory._({required this.entries}) : super._();
  @override
  ProgressionHistory rebuild(
          void Function(ProgressionHistoryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionHistoryBuilder toBuilder() =>
      ProgressionHistoryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionHistory && entries == other.entries;
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
    return (newBuiltValueToStringHelper(r'ProgressionHistory')
          ..add('entries', entries))
        .toString();
  }
}

class ProgressionHistoryBuilder
    implements Builder<ProgressionHistory, ProgressionHistoryBuilder> {
  _$ProgressionHistory? _$v;

  ListBuilder<ProgressionLedgerEntry>? _entries;
  ListBuilder<ProgressionLedgerEntry> get entries =>
      _$this._entries ??= ListBuilder<ProgressionLedgerEntry>();
  set entries(ListBuilder<ProgressionLedgerEntry>? entries) =>
      _$this._entries = entries;

  ProgressionHistoryBuilder() {
    ProgressionHistory._defaults(this);
  }

  ProgressionHistoryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _entries = $v.entries.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionHistory other) {
    _$v = other as _$ProgressionHistory;
  }

  @override
  void update(void Function(ProgressionHistoryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionHistory build() => _build();

  _$ProgressionHistory _build() {
    _$ProgressionHistory _$result;
    try {
      _$result = _$v ??
          _$ProgressionHistory._(
            entries: entries.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'entries';
        entries.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProgressionHistory', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
