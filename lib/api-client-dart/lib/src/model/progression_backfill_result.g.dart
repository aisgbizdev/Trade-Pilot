// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_backfill_result.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionBackfillResult extends ProgressionBackfillResult {
  @override
  final int awarded;
  @override
  final int scanned;
  @override
  final String ruleVersion;

  factory _$ProgressionBackfillResult(
          [void Function(ProgressionBackfillResultBuilder)? updates]) =>
      (ProgressionBackfillResultBuilder()..update(updates))._build();

  _$ProgressionBackfillResult._(
      {required this.awarded, required this.scanned, required this.ruleVersion})
      : super._();
  @override
  ProgressionBackfillResult rebuild(
          void Function(ProgressionBackfillResultBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionBackfillResultBuilder toBuilder() =>
      ProgressionBackfillResultBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionBackfillResult &&
        awarded == other.awarded &&
        scanned == other.scanned &&
        ruleVersion == other.ruleVersion;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, awarded.hashCode);
    _$hash = $jc(_$hash, scanned.hashCode);
    _$hash = $jc(_$hash, ruleVersion.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProgressionBackfillResult')
          ..add('awarded', awarded)
          ..add('scanned', scanned)
          ..add('ruleVersion', ruleVersion))
        .toString();
  }
}

class ProgressionBackfillResultBuilder
    implements
        Builder<ProgressionBackfillResult, ProgressionBackfillResultBuilder> {
  _$ProgressionBackfillResult? _$v;

  int? _awarded;
  int? get awarded => _$this._awarded;
  set awarded(int? awarded) => _$this._awarded = awarded;

  int? _scanned;
  int? get scanned => _$this._scanned;
  set scanned(int? scanned) => _$this._scanned = scanned;

  String? _ruleVersion;
  String? get ruleVersion => _$this._ruleVersion;
  set ruleVersion(String? ruleVersion) => _$this._ruleVersion = ruleVersion;

  ProgressionBackfillResultBuilder() {
    ProgressionBackfillResult._defaults(this);
  }

  ProgressionBackfillResultBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _awarded = $v.awarded;
      _scanned = $v.scanned;
      _ruleVersion = $v.ruleVersion;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionBackfillResult other) {
    _$v = other as _$ProgressionBackfillResult;
  }

  @override
  void update(void Function(ProgressionBackfillResultBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionBackfillResult build() => _build();

  _$ProgressionBackfillResult _build() {
    final _$result = _$v ??
        _$ProgressionBackfillResult._(
          awarded: BuiltValueNullFieldError.checkNotNull(
              awarded, r'ProgressionBackfillResult', 'awarded'),
          scanned: BuiltValueNullFieldError.checkNotNull(
              scanned, r'ProgressionBackfillResult', 'scanned'),
          ruleVersion: BuiltValueNullFieldError.checkNotNull(
              ruleVersion, r'ProgressionBackfillResult', 'ruleVersion'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
