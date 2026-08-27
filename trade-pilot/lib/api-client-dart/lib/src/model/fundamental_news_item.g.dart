// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fundamental_news_item.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FundamentalNewsItem extends FundamentalNewsItem {
  @override
  final String id;
  @override
  final String title;
  @override
  final String summary;
  @override
  final String source_;
  @override
  final String url;
  @override
  final DateTime publishedAt;

  factory _$FundamentalNewsItem(
          [void Function(FundamentalNewsItemBuilder)? updates]) =>
      (FundamentalNewsItemBuilder()..update(updates))._build();

  _$FundamentalNewsItem._(
      {required this.id,
      required this.title,
      required this.summary,
      required this.source_,
      required this.url,
      required this.publishedAt})
      : super._();
  @override
  FundamentalNewsItem rebuild(
          void Function(FundamentalNewsItemBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FundamentalNewsItemBuilder toBuilder() =>
      FundamentalNewsItemBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FundamentalNewsItem &&
        id == other.id &&
        title == other.title &&
        summary == other.summary &&
        source_ == other.source_ &&
        url == other.url &&
        publishedAt == other.publishedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, title.hashCode);
    _$hash = $jc(_$hash, summary.hashCode);
    _$hash = $jc(_$hash, source_.hashCode);
    _$hash = $jc(_$hash, url.hashCode);
    _$hash = $jc(_$hash, publishedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FundamentalNewsItem')
          ..add('id', id)
          ..add('title', title)
          ..add('summary', summary)
          ..add('source_', source_)
          ..add('url', url)
          ..add('publishedAt', publishedAt))
        .toString();
  }
}

class FundamentalNewsItemBuilder
    implements Builder<FundamentalNewsItem, FundamentalNewsItemBuilder> {
  _$FundamentalNewsItem? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _title;
  String? get title => _$this._title;
  set title(String? title) => _$this._title = title;

  String? _summary;
  String? get summary => _$this._summary;
  set summary(String? summary) => _$this._summary = summary;

  String? _source_;
  String? get source_ => _$this._source_;
  set source_(String? source_) => _$this._source_ = source_;

  String? _url;
  String? get url => _$this._url;
  set url(String? url) => _$this._url = url;

  DateTime? _publishedAt;
  DateTime? get publishedAt => _$this._publishedAt;
  set publishedAt(DateTime? publishedAt) => _$this._publishedAt = publishedAt;

  FundamentalNewsItemBuilder() {
    FundamentalNewsItem._defaults(this);
  }

  FundamentalNewsItemBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _title = $v.title;
      _summary = $v.summary;
      _source_ = $v.source_;
      _url = $v.url;
      _publishedAt = $v.publishedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FundamentalNewsItem other) {
    _$v = other as _$FundamentalNewsItem;
  }

  @override
  void update(void Function(FundamentalNewsItemBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FundamentalNewsItem build() => _build();

  _$FundamentalNewsItem _build() {
    final _$result = _$v ??
        _$FundamentalNewsItem._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'FundamentalNewsItem', 'id'),
          title: BuiltValueNullFieldError.checkNotNull(
              title, r'FundamentalNewsItem', 'title'),
          summary: BuiltValueNullFieldError.checkNotNull(
              summary, r'FundamentalNewsItem', 'summary'),
          source_: BuiltValueNullFieldError.checkNotNull(
              source_, r'FundamentalNewsItem', 'source_'),
          url: BuiltValueNullFieldError.checkNotNull(
              url, r'FundamentalNewsItem', 'url'),
          publishedAt: BuiltValueNullFieldError.checkNotNull(
              publishedAt, r'FundamentalNewsItem', 'publishedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
