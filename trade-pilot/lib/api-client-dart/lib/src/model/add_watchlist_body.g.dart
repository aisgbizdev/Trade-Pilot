// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'add_watchlist_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AddWatchlistBody extends AddWatchlistBody {
  @override
  final String instrument;

  factory _$AddWatchlistBody(
          [void Function(AddWatchlistBodyBuilder)? updates]) =>
      (AddWatchlistBodyBuilder()..update(updates))._build();

  _$AddWatchlistBody._({required this.instrument}) : super._();
  @override
  AddWatchlistBody rebuild(void Function(AddWatchlistBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AddWatchlistBodyBuilder toBuilder() =>
      AddWatchlistBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AddWatchlistBody && instrument == other.instrument;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AddWatchlistBody')
          ..add('instrument', instrument))
        .toString();
  }
}

class AddWatchlistBodyBuilder
    implements Builder<AddWatchlistBody, AddWatchlistBodyBuilder> {
  _$AddWatchlistBody? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  AddWatchlistBodyBuilder() {
    AddWatchlistBody._defaults(this);
  }

  AddWatchlistBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AddWatchlistBody other) {
    _$v = other as _$AddWatchlistBody;
  }

  @override
  void update(void Function(AddWatchlistBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AddWatchlistBody build() => _build();

  _$AddWatchlistBody _build() {
    final _$result = _$v ??
        _$AddWatchlistBody._(
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'AddWatchlistBody', 'instrument'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
