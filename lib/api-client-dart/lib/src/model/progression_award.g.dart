// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_award.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionAward extends ProgressionAward {
  @override
  final bool awarded;
  @override
  final int xp;
  @override
  final String? reason;

  factory _$ProgressionAward(
          [void Function(ProgressionAwardBuilder)? updates]) =>
      (ProgressionAwardBuilder()..update(updates))._build();

  _$ProgressionAward._({required this.awarded, required this.xp, this.reason})
      : super._();
  @override
  ProgressionAward rebuild(void Function(ProgressionAwardBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionAwardBuilder toBuilder() =>
      ProgressionAwardBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionAward &&
        awarded == other.awarded &&
        xp == other.xp &&
        reason == other.reason;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, awarded.hashCode);
    _$hash = $jc(_$hash, xp.hashCode);
    _$hash = $jc(_$hash, reason.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProgressionAward')
          ..add('awarded', awarded)
          ..add('xp', xp)
          ..add('reason', reason))
        .toString();
  }
}

class ProgressionAwardBuilder
    implements Builder<ProgressionAward, ProgressionAwardBuilder> {
  _$ProgressionAward? _$v;

  bool? _awarded;
  bool? get awarded => _$this._awarded;
  set awarded(bool? awarded) => _$this._awarded = awarded;

  int? _xp;
  int? get xp => _$this._xp;
  set xp(int? xp) => _$this._xp = xp;

  String? _reason;
  String? get reason => _$this._reason;
  set reason(String? reason) => _$this._reason = reason;

  ProgressionAwardBuilder() {
    ProgressionAward._defaults(this);
  }

  ProgressionAwardBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _awarded = $v.awarded;
      _xp = $v.xp;
      _reason = $v.reason;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionAward other) {
    _$v = other as _$ProgressionAward;
  }

  @override
  void update(void Function(ProgressionAwardBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionAward build() => _build();

  _$ProgressionAward _build() {
    final _$result = _$v ??
        _$ProgressionAward._(
          awarded: BuiltValueNullFieldError.checkNotNull(
              awarded, r'ProgressionAward', 'awarded'),
          xp: BuiltValueNullFieldError.checkNotNull(
              xp, r'ProgressionAward', 'xp'),
          reason: reason,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
