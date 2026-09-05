// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_audit.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionAudit extends ProgressionAudit {
  @override
  final BuiltList<ProgressionAuditEntry> entries;

  factory _$ProgressionAudit(
          [void Function(ProgressionAuditBuilder)? updates]) =>
      (ProgressionAuditBuilder()..update(updates))._build();

  _$ProgressionAudit._({required this.entries}) : super._();
  @override
  ProgressionAudit rebuild(void Function(ProgressionAuditBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionAuditBuilder toBuilder() =>
      ProgressionAuditBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionAudit && entries == other.entries;
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
    return (newBuiltValueToStringHelper(r'ProgressionAudit')
          ..add('entries', entries))
        .toString();
  }
}

class ProgressionAuditBuilder
    implements Builder<ProgressionAudit, ProgressionAuditBuilder> {
  _$ProgressionAudit? _$v;

  ListBuilder<ProgressionAuditEntry>? _entries;
  ListBuilder<ProgressionAuditEntry> get entries =>
      _$this._entries ??= ListBuilder<ProgressionAuditEntry>();
  set entries(ListBuilder<ProgressionAuditEntry>? entries) =>
      _$this._entries = entries;

  ProgressionAuditBuilder() {
    ProgressionAudit._defaults(this);
  }

  ProgressionAuditBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _entries = $v.entries.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionAudit other) {
    _$v = other as _$ProgressionAudit;
  }

  @override
  void update(void Function(ProgressionAuditBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionAudit build() => _build();

  _$ProgressionAudit _build() {
    _$ProgressionAudit _$result;
    try {
      _$result = _$v ??
          _$ProgressionAudit._(
            entries: entries.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'entries';
        entries.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProgressionAudit', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
